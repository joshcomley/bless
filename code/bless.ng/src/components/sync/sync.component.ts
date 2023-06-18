import { ChangeDetectorRef, Directive, Inject, Input, NgZone, OnDestroy, OnInit } from "@angular/core";
import { BLESS_LOCAL_STORAGE_SERVICE } from "@bless/core";
import { NotifierService } from "@bless/ng";
import { BlessLocalStorageServiceBase, BLESS_CONNECTION_MONITOR_TOKEN, ConnectionMonitorService } from "@bless/platform";
import { DataContext, IDataContext, IDbQueryable, SaveChangeKind } from "@brandless/iql.data";
import { EventSubscription } from "@brandless/iql.events";
import { IqlSyncService, IqlSyncSetCompleteEvent } from "@brandless/iql.forms";
import { Enum } from "@brandless/tsutility";
// https://github.com/jvandemo/generator-angular2-library/issues/221#issuecomment-355945207
import * as moment_ from 'moment';
import { Subscription } from "rxjs";
			
const moment = moment_;

@Directive()
export abstract class SyncComponentDirective implements OnInit, OnDestroy {
	@Input() public db: IDataContext;
	@Input() public queries: IDbQueryable[];

	private static LastSyncDateKey = "Sync:LastDate";

	public _connectionSub: Subscription;
	public _progressSub: EventSubscription;
	public _setCompleteSub: EventSubscription;
	public _statusChangeSub: EventSubscription;
	public completedSets = new Array<IqlSyncSetCompleteEvent>();
	public elevation = 10;
	public hasOfflineChanges: boolean;
	public lastSyncIcon: string = "mi-sync";
	public lastSyncTime: string = "Checking...";
	public offlineStateChangeSub: EventSubscription;
	public progressValue: number;
	public status: string = "";
	public syncIcon: string = "mi-sync";
	public syncService: IqlSyncService;
	public timeTaken: string;
	public updateSyncTimeInterval = null;
	public variant = 'elevated';

	public get isSyncing(): boolean {
    return SyncComponentDirective["_isSyncing"];
  }

	constructor(
    private zone: NgZone,
    private notifier: NotifierService,
    public cdr: ChangeDetectorRef,
    @Inject(BLESS_CONNECTION_MONITOR_TOKEN) public connectionMonitor: ConnectionMonitorService,
    @Inject(BLESS_LOCAL_STORAGE_SERVICE) public localStorage: BlessLocalStorageServiceBase
    ) {
    if (!this.connectionMonitor) {
      // IqlLoggerService.IfEnabled(() => IqlLoggerService.Log("NO CONNECTION MONITOR SERVICE"));
    } else {
      this.connectionMonitor.startMonitoring();
      this.refreshConnectionStatus();
    }
    this.syncService = new IqlSyncService();
    this._progressSub = this.syncService.OnProgress.Subscribe(_ => {
      this.progressValue = _.Progress * 100;
      this.cdr.detectChanges();
    });
    this._statusChangeSub = this.syncService.OnStatusChange.Subscribe(_ => {
      this.status = _.Text;
      this.cdr.detectChanges();
    });
    this._setCompleteSub = this.syncService.OnSetComplete.Subscribe(_ => {
      this.completedSets.push(_);
      this.cdr.detectChanges();
    });
    this._connectionSub = this.connectionMonitor.connectionStatusChanged.subscribe(_ => {
      if (!_.hasConnection) {
        this.syncIcon = "mi-sync_disabled";
      } else {
        this.syncIcon = this.lastSyncIcon;
      }
      this.cdr.detectChanges();
    });
  }

	public ngOnDestroy(): void {
    if (this.offlineStateChangeSub) {
      this.offlineStateChangeSub.Unsubscribe();
    }
    if (this.updateSyncTimeInterval) {
      clearInterval(this.updateSyncTimeInterval);
    }
    if (this._connectionSub) {
      this._connectionSub.unsubscribe();
    }
    if (this._setCompleteSub) {
      this._setCompleteSub.Unsubscribe();
    }
    if (this._progressSub) {
      this._progressSub.Unsubscribe();
    }
    if (this._statusChangeSub) {
      this._statusChangeSub.Unsubscribe();
    }
  }

	public ngOnInit() {
    this.updateLastSyncTimeDisplay();
    this.updateSyncTimeInterval = setInterval(() => {
      this.updateLastSyncTimeDisplay();
    }, 5000);
    this.hasOfflineChanges = this.db.HasOfflineChanges;
    this.offlineStateChangeSub = (<DataContext>this.db).OfflineStateChanged.Subscribe(_ => {
      this.hasOfflineChanges = _.HasChanges;
    });
    this.connectionMonitor.forceRefreshAsync().then(_ => {
      this.cdr.detectChanges();
    });
  }

	public notifyChange(jusficiation: string) {
    this.cdr.markForCheck();
  }

	public refreshConnectionStatus(notify: boolean = false) {
    // IqlLoggerService.IfEnabled(() => IqlLoggerService.Log("Refreshing connection status"));
    this.connectionMonitor.forceRefreshAsync().then(() => {
      if (notify) {
        this.notifier.info("Status refreshed");
      }
      this.cdr.detectChanges();
    });
  }

	public async sync() {
    await this.connectionMonitor.forceRefreshAsync();
    if (await this.connectionMonitor.hasConnectionAsync()) {
      if (!SyncComponentDirective["_isSyncing"]) {
        SyncComponentDirective["_isSyncing"] = true;
        this.notifyChange('Syncing begun');
        this.timeTaken = "";
        if (this.db.HasOfflineChanges) {
          this.status = "Syncing your changes...";
          this.cdr.detectChanges();
          this.notifier.info("Saving your changes...");
          this.db.SaveOfflineChangesAsync().then(async result => {
            this.status = Enum.GetName(SaveChangeKind, result.Kind);
            if (result.Success) {
              this.notifier.info("Saved");
              await this.downloadAllDataAsync();
              this.hasOfflineChanges = this.db.HasOfflineChanges;
            } else {
              this.notifier.error("Syncing failed");
              this.zone.run(() => {
                this.status = "Unable to sync your changes";
                SyncComponentDirective["_isSyncing"] = false;
                this.hasOfflineChanges = this.db.HasOfflineChanges;
                this.cdr.detectChanges();
              });
            }
          });
        } else {
          await this.downloadAllDataAsync();
        }
      }
    } else {
      this.notifier.info("You do not appear to be connected at this time.");
    }
  }

	private async downloadAllDataAsync() {
    await this.connectionMonitor.forceRefreshAsync();
    if (await this.connectionMonitor.hasConnectionAsync()) {
      this.db.ClearOfflineStateAsync()
        .then(async result => {
          if (result) {
            this.timeTaken = "";
            this.completedSets = [];
            this.cdr.detectChanges();
            let result = await this.syncService.SyncAsync(this.queries);
            if (!result.Success) {
              this.indicateSyncingProblem();
            }
            else {
              this.timeTaken = `Completed in ${result.TimeTakenInSeconds.toString()}s`;
              this.localStorage.set(SyncComponentDirective.LastSyncDateKey, new Date());
              this.updateLastSyncTimeDisplay();
              this.lastSyncIcon = "mi-sync";
              this.syncIcon = "mi-sync";
            }
            SyncComponentDirective["_isSyncing"] = false;
            this.hasOfflineChanges = this.db.HasOfflineChanges;
            this.cdr.detectChanges();
          } else {
            this.indicateSyncingProblem();
          }
        });
    } else {
      this.indicateSyncingProblem();
    }
  }

	private indicateSyncingProblem() {
    SyncComponentDirective["_isSyncing"] = false;
    this.timeTaken = "";
    this.lastSyncIcon = "mi-sync_problem";
    this.syncIcon = "mi-sync_problem";
    this.cdr.detectChanges();
  }

	private updateLastSyncTimeDisplay() {
    let lastSyncTime = new Date(this.localStorage.get(SyncComponentDirective.LastSyncDateKey));
    this.lastSyncTime = lastSyncTime ? moment(lastSyncTime).fromNow() : "Never";
    this.cdr.detectChanges();
  }
}