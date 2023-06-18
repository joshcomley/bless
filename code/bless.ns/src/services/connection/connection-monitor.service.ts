import { EventEmitter, EventSubscription } from "@brandless/iql.events";
			
import * as Connectivity from "@nativescript/core/connectivity";
import { ConnectionKind, ConnectionMonitorService } from "@bless/platform";

export class ConnectionMonitor extends ConnectionMonitorService {
    private static _nativescriptConnectionStatusChanged = new EventEmitter<Connectivity.connectionType>();
    private static _nativescriptMonitorStarted = false;

    private _statusChangeSubscription: EventSubscription;

    public getLatestStatusAsync(): Promise<ConnectionKind> {
        let promise = new Promise<ConnectionKind>(resolver => {
            let type = Connectivity.getConnectionType();
            let kind = this.resolveIqlConnectionKind(type);
            this.updateStatus(kind);
            resolver(kind);
        });
        return promise;
    }

    public hasConnectionAsync(): Promise<boolean> {
        let promise = new Promise<boolean>(resolver => {
            resolver(this.hasConnection);
        })
        return promise;
    }

    public startMonitoring() {
        this.startStaticMonitoringIfNecessary();
        this._statusChangeSubscription = ConnectionMonitor._nativescriptConnectionStatusChanged.Subscribe(_ => {
            this.updateStatus(this.resolveIqlConnectionKind(_));
        });
    }

    public stopMonitoring() {
        if (this._statusChangeSubscription) {
            this._statusChangeSubscription.Unsubscribe();
        }
    }

    private resolveIqlConnectionKind(kind: Connectivity.connectionType) {
        switch (kind) {
            case Connectivity.connectionType.wifi:
                return ConnectionKind.WiFi;
            case Connectivity.connectionType.ethernet:
                return ConnectionKind.Ethernet;
            case Connectivity.connectionType.bluetooth:
                return ConnectionKind.Bluetooth;
            case Connectivity.connectionType.mobile:
                return ConnectionKind.Mobile;
            case Connectivity.connectionType.none:
                return ConnectionKind.None;
        }
        return ConnectionKind.Unknown;
    }

    private startStaticMonitoringIfNecessary() {
        if (!ConnectionMonitor._nativescriptMonitorStarted) {
            ConnectionMonitor._nativescriptMonitorStarted = true;
            let type = Connectivity.getConnectionType();
            let kind = this.resolveIqlConnectionKind(type);
            this.updateStatus(kind);
            Connectivity.startMonitoring(connectionType => {
                ConnectionMonitor._nativescriptConnectionStatusChanged.Emit(() => connectionType);
                // IqlLoggerService.IfEnabled(() => IqlLoggerService.Log("Connection status change received"));
                this.updateStatus(this.resolveIqlConnectionKind(connectionType));
            });
        }
    }
}