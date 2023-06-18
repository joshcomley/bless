import { ConnectionKind } from "./connection-kind";
			
export class ConnectionStatusChangedEvent {
    private _status: ConnectionKind;

    constructor(status: ConnectionKind) {
        this._status = status;
    }

    public get hasConnection() {
        return this.status != ConnectionKind.None;
    }

    public get status(): ConnectionKind {
        return this._status;
    }
}