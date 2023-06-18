import { Subject } from "rxjs";
import { ConnectionKind } from "./connection-kind";
import { ConnectionStatusChangedEvent } from "./connection-status-changed.event";
			
export abstract class ConnectionMonitorService {
    private _status: ConnectionKind;

    protected static UnknownText = "Unknown";

    public connectionStatusChanged = new Subject<ConnectionStatusChangedEvent>();

    public get hasConnection(): boolean {
        return this.status != ConnectionKind.None && this.statusText != ConnectionMonitorService.UnknownText;
    }

    public get status(): ConnectionKind {
        return this._status;
    }

    public get statusText(): string {
        switch (this.status) {
            case ConnectionKind.None:
                return "No connection";
            case ConnectionKind.WiFi:
                return "Connected to wifi";
            case ConnectionKind.Mobile:
                return "Connected to cellular";
            case ConnectionKind.Bluetooth:
                return "Connected to bluetooth";
            case ConnectionKind.Ethernet:
                return "Connected to ethernet";
        }
        return ConnectionMonitorService.UnknownText;
    }

    public async forceRefreshAsync() {
        this.updateStatus(await this.getLatestStatusAsync());
    }

    public abstract getLatestStatusAsync(): Promise<ConnectionKind>;
    // {
    //     return this.status != Connectivity.connectionType.none && this.statusText != ConnectionMonitor._unknownText;
    // }
    public abstract hasConnectionAsync(): Promise<boolean>;
    public abstract startMonitoring();
    public abstract stopMonitoring();

    protected updateStatus(connectionType: ConnectionKind) {
        let old = this._status;
        this._status = connectionType;
        if (old != connectionType) {
            this.connectionStatusChanged.next(new ConnectionStatusChangedEvent(connectionType));
        }
    }
}