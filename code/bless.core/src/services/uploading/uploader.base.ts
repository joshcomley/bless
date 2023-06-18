import { IInjector } from "../injector/injector";
import { EventEmitter, AsyncEventEmitter } from "@brandless/iql.events";
import { BLESS_LOCAL_STORAGE_SERVICE, ILocalStorageService } from "../local-storage";
import { UploadCompleteEvent } from "./upload-complete.event";
import { UploadErrorEvent } from "./upload-error.event";
import { UploadProgressEvent } from "./upload-progress.event";
import { UploadStartEvent } from "./upload-start.event";
import { UploadState } from "./upload.state";

export interface IUploaderEvents {
    emitComplete(success: boolean);
    emitError(message?: string);
    emitProgress(progress: number);
    emitStart();
}

export abstract class UploaderService implements IUploaderEvents {
    protected localSettings: ILocalStorageService;
    protected statuses = new Map<string, UploadState>();

    public counter: number = 0;
    public events: IUploaderEvents = this;
    public isError: boolean;
    public isUploaded: boolean;
    public isUploading: boolean;
    public onComplete = new EventEmitter<UploadCompleteEvent<UploaderService>>();
    public onCompleteAsync = new AsyncEventEmitter<UploadCompleteEvent<UploaderService>>();
    public onError = new EventEmitter<UploadErrorEvent<UploaderService>>();
    public onErrorAsync = new AsyncEventEmitter<UploadErrorEvent<UploaderService>>();
    public onProgress = new EventEmitter<UploadProgressEvent<UploaderService>>();
    public onStart = new EventEmitter<UploadStartEvent<UploaderService>>();
    public onStartAsync = new AsyncEventEmitter<UploadStartEvent<UploaderService>>();

    constructor(protected injector: IInjector) {
        this.localSettings = injector.inject(BLESS_LOCAL_STORAGE_SERVICE);
    }

    public static ConvertDataUrlToBlobAsync(dataUrl: string): Promise<Blob> {
        let promise = new Promise<Blob>(resolver => {
            if (dataUrl.startsWith("blob:")) {
                fetch(dataUrl).then(r => resolver(r.blob())).catch(r => resolver(null));
                // var xhr = new XMLHttpRequest();
                // xhr.open('GET', dataUrl, true);
                // xhr.responseType = 'blob';
                // xhr.onload = function (e) {
                //     if (this.status == 200) {
                //         resolver(this.response);
                //     } else {
                //         resolver(null);
                //     }
                // };
                // xhr.onerror = function (e) {
                //     resolver(null);
                // }
                // xhr.send();
            } else {
                var arr = dataUrl.split(","), mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                resolver(new Blob([u8arr], { type: mime }));
            }
        });
        return promise;
    }

    public GetStatus(key: string): UploadState {
        let json = this.injector.inject(BLESS_LOCAL_STORAGE_SERVICE)
            .getString(this.GetStatusKey(key));
        if (json) {
            return JSON.parse(json) as UploadState;
        }
        return null;
    }

    public SetStatus(key: string, status: UploadState) {
        this.injector.inject(BLESS_LOCAL_STORAGE_SERVICE).setString(
            this.GetStatusKey(key),
            JSON.stringify(status));
    }

    public emitComplete(success: boolean) {
        this.onComplete.Emit(() => new UploadCompleteEvent(this, success));
    }

    public emitError(message: string = null) {
        this.onError.Emit(() => new UploadErrorEvent(this, message));
    }

    public emitProgress(progress: number) {
        this.onProgress.Emit(() => new UploadProgressEvent(this, progress));
    }

    public emitStart() {
        this.onStart.Emit(() => new UploadStartEvent(this));
    }

    public async uploadFromUrl(
        file: string,
        fetchUrlAsync: () => Promise<string>,
        contentType: string,
        deleteAfterUpload: boolean,
        downloadName?: string,
        key?: string,
        onBlob?: (blob: Blob, contentType: string) => void): Promise<boolean> {
        let blob = await UploaderService.ConvertDataUrlToBlobAsync(file);
        contentType = contentType || blob.type;
        if (onBlob != null) {
            onBlob(blob, contentType);
        }
        return this.uploadFromBlob(
            blob,
            fetchUrlAsync,
            contentType,
            deleteAfterUpload,
            downloadName,
            key);
    }

    public abstract uploadFromBlob(
        file: Blob, 
        fetchUrlAsync: () => Promise<string>, 
        contentType: string, 
        deleteAfterUpload: boolean, 
        downloadName?: string, 
        key?: string): Promise<boolean>;

    protected updateStatus(key: string, action: (status: UploadState) => void): void {
        let status = this.statuses.get(key);
        action(status);
        this.SetStatus(key, status);
    }

    private GetStatusKey(key: string) {
        return `Uploader:${key}`;
    }

    // public async emitStartAsync() {
    //     await this.onStartAsync.EmitAsync(() => new IqlUploadStartEvent(this));
    // }

    // public async emitCompleteAsync(success: boolean) {
    //     await this.onCompleteAsync.EmitAsync(() => new IqlUploadCompleteEvent(this, success));
    // }

    // public async emitErrorAsync(message: string = null) {
    //     await this.onErrorAsync.EmitAsync(() => new IqlUploadErrorEvent(this, message));
    // }
}