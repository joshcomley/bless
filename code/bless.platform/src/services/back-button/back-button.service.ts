import { Subject } from 'rxjs';

export interface BackButtonEvent {
    cancel: boolean;
}

export abstract class BackButtonServiceBase {
    public prevent: boolean = false;
    public onBackButton = new Subject<BackButtonEvent>();
    public abstract init(): void;
    public abstract dispose(): void;
}