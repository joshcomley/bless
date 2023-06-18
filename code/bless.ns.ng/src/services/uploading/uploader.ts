import { Injectable, Injector } from "@angular/core";
import { BLESS_INJECTOR_SERVICE, IInjector, UploadCompleteEvent, UploaderService, UploadErrorEvent, UploadProgressEvent, UploadState } from "@bless/core";
import * as bghttp from "@nativescript/background-http";
import { File } from "@nativescript/core/file-system";
import { LogService } from "~/app/common/services/log.service";

@Injectable({ providedIn: 'root' })
export class Uploader extends UploaderService {
    private session: any;

    public tasks: bghttp.Task[] = [];

    constructor(injector: Injector,
        private log: LogService) {
        super(injector.get<IInjector>(BLESS_INJECTOR_SERVICE as any));
    }

    public override uploadFromBlob(
        file: Blob,
        fetchUrlAsync: () => Promise<string>,
        contentType: string,
        deleteAfterUpload: boolean,
        downloadName?: string,
        key?: string): Promise<boolean> {
        throw new Error("Method not implemented - (`1b0565e6-8b99-4da6-8421-a70f1b2c2afe`)");
    }

    public override async uploadFromUrl(
        pathOfFileToUpload: string,
        fetchDestinationUrlAsync: () => Promise<string>,
        contentType: string,
        deleteAfterUpload: boolean,
        downloadName?: string,
        key?: string,
        onBlob?: (blob: Blob, contentType: string) => void): Promise<boolean> {
        fetchDestinationUrlAsync().then(url => {
            key = key || url;
            let status = this.GetStatus(key);
            if (status != null && !status.isComplete) {
                // Cancel existing download or error..?
            }
            status = new UploadState(key, url, pathOfFileToUpload, contentType, downloadName);
            this.statuses.set(key, status);
            let shouldFail = false;
            let isMulti = false;
            this.log.log("Getting upload session");
            this.session = bghttp.session("image-upload");
            // IqlLoggerService.IfEnabled(() => IqlLoggerService.Log((shouldFail ? "Testing error during upload of " : "Uploading file: ") + pathOfFileToUpload + (isMulti ? " using multipart." : "")));
            const name = pathOfFileToUpload.substring(pathOfFileToUpload.lastIndexOf("/") + 1);
            this.log.log(`File name: ${name}`);
            downloadName = downloadName || name;
            const description = `${name} (${++this.counter})`;
            const request = {
                url: url,
                method: "PUT",
                headers: {
                    'x-ms-blob-content-disposition': 'attachment; filename="' + downloadName + '"',
                    'x-ms-blob-type': 'BlockBlob',
                    'Content-Type': contentType,
                    "File-Name": downloadName
                },
                description: description,
                androidAutoDeleteAfterUpload: deleteAfterUpload || false,
                androidNotificationTitle: 'sync'
            };

            if (shouldFail) {
                request.headers["Should-Fail"] = true;
            }

            let task: bghttp.Task;
            if (isMulti) {
                const params = [
                    { name: "test", value: "value" },
                    { name: "fileToUpload", filename: pathOfFileToUpload, mimeType: 'image/jpeg' }
                ];
                this.log.log(`multipartUpload`);
                task = this.session.multipartUpload(params, request);
            } else {
                this.log.log(`uploadFile`);
                task = this.session.uploadFile(pathOfFileToUpload, request);
            }

            task.on("progress", p => {
                let progress = (100 / p.totalBytes) * p.currentBytes;
                this.updateStatus(key, _ => _.progress = progress);
                this.onProgress.Emit(() => new UploadProgressEvent(this, progress));
            });

            task.on("error", error => {
                alert(error.error);
                this.log.logError(`Upload error: ${error.eventName}`);
                this.log.logError(`Upload error: ${error.error}`);
                this.onError.Emit(() => new UploadErrorEvent(this));
            });

            // task.on("responded", onEvent.bind(this));

            task.on("complete", async e => {
                this.log.log(`Upload complete`);
                this.updateStatus(key, _ => {
                    _.progress = 100;
                    _.isComplete = true;
                });
                if (deleteAfterUpload) {
                    let fileEntry = File.fromPath(pathOfFileToUpload);
                    if (fileEntry) {
                        await fileEntry.remove();
                    }
                }
                this.onComplete.Emit(() => new UploadCompleteEvent(this, true));
            });
            this.log.log(`Push task`);
            this.tasks.push(task);
        });
        return Promise.resolve(true);
    }
}