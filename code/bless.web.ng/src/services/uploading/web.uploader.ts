import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { BLESS_INJECTOR_SERVICE, IInjector, CancellationToken, UploaderService } from "@bless/core";
			
class AzureConfig {
    public baseUrl: string;
    public blockSize: number;
    public file: Blob;
    public fileNameToDownloadAs: string;
    public notAuthenticatedRetries = -1;
    public sasToken: string;
    public urlAsync: () => Promise<string>;

    public get fileUrl(): string {
        return this.baseUrl + this.sasToken;
    }

    public async loadUrlAsync() {
        let url = await this.urlAsync();
        let urlParts = url.split("?");
        let baseUrl = urlParts[0];
        let sasToken = "?" + urlParts[1];
        this.baseUrl = baseUrl;
        this.sasToken = sasToken;
        this.notAuthenticatedRetries++;
    }
}

@Injectable()
export class Uploader extends UploaderService {
    private http: HttpClient;

    public defaultBlockSize = 1024 * 256;

    constructor(injector: Injector) {
        super(injector.get<IInjector>(BLESS_INJECTOR_SERVICE as any));
        this.http = injector.get(HttpClient);
    }

    public commitBlockList(state, config: AzureConfig, resolver: (value?: boolean | PromiseLike<boolean>) => void, cancellationToken: CancellationToken) {
        if (state.cancelled || (cancellationToken != null && cancellationToken.cancel == true)) {
            resolver(false);
            return;
        }
        let ctx = this;
        let uri = config.fileUrl + "&comp=blocklist";
        //$log.log(uri);

        let requestBody = "<?xml version=\"1.0\" encoding=\"utf-8\"?><BlockList>";
        for (let i = 0; i < state.blockIds.length; i++) {
            requestBody += "<Latest>" + state.blockIds[i] + "</Latest>";
        }
        requestBody += "</BlockList>";
        //$log.log(requestBody);

        //$http.defaults.headers.put["x-ms-blob-content-type"] = state.file.type;
        this.http.put(uri,
            requestBody,
            {
                headers: {
                    "x-ms-blob-content-disposition": "attachment; filename=\"" + config.fileNameToDownloadAs + "\"",
                    "x-ms-blob-content-type": state.file.type
                }
            }).subscribe(result => {
                //$log.log(data);
                //$log.log(status);
                if (config.notAuthenticatedRetries) {
                    config.notAuthenticatedRetries = 0;
                }
                // IqlLoggerService.IfEnabled(() => IqlLoggerService.Log("Upload complete"));
                resolver(true);
                //if (state.complete) state.complete(data, status, headers, config);
                //ctx.onComplete.Emit(() => new IqlCdnUploadComplete(true))
                this.events.emitComplete(true);
            },
                async error => {
                    if (error instanceof HttpErrorResponse) {
                        if (error.status === 403 && config.notAuthenticatedRetries < 10) {
                            await config.loadUrlAsync();
                            this.commitBlockList(state, config, resolver, cancellationToken);
                            return;
                        }
                    }
                    this.events.emitError();
                    this.events.emitComplete(false);
                    resolver(false);
                    //$log.log(data);
                    //$log.log(status);
                    // if (state.error) state.error(data, status, headers, config);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
    }

    public initializeState(config: AzureConfig) {
        let blockSize = config.blockSize || this.defaultBlockSize;
        let maxBlockSize = blockSize; // Default Block Size
        let numberOfBlocks = 1;

        let file = config.file;

        let fileSize = file.size;
        if (fileSize < blockSize) {
            maxBlockSize = fileSize;
            //$log.log("max block size = " + maxBlockSize);
        }

        if (fileSize % maxBlockSize == 0) {
            numberOfBlocks = +fileSize / +maxBlockSize;
        } else {
            numberOfBlocks = +fileSize / +maxBlockSize + 1;
        }

        //$log.log("total blocks = " + numberOfBlocks);

        return {
            maxBlockSize: maxBlockSize, //Each file will be split in 256 KB.
            numberOfBlocks: numberOfBlocks,
            totalBytesRemaining: fileSize,
            currentFilePointer: 0,
            blockIds: new Array(),
            blockIdPrefix: "block-",
            bytesUploaded: 0,
            submitUri: null,
            file: file,
            config: config,
            cancelled: false
        };
    }

    public pad(number, length) {
        let str = "" + number;
        while (str.length < length) {
            str = "0" + str;
        }
        return str;
    }

    public uploadFromBlob(file: Blob, fetchUrlAsync: () => Promise<string>, contentType: string, deleteAfterUpload: boolean, downloadName?: string, key?: string, cancellationToken: CancellationToken = null): Promise<boolean> {
        let uploadPromise = new Promise<boolean>(async resolver => {
            let config = new AzureConfig();
            config.urlAsync = fetchUrlAsync;
            config.file = file;
            config.fileNameToDownloadAs = downloadName;
            let resolverWrapper = (value?: boolean | PromiseLike<boolean>) => {
                resolver(value);
            };
            this.uploadAsync(config, resolverWrapper, cancellationToken);
        });
        return uploadPromise;
    }

    // Default to 32KB

    /* config: {
      baseUrl: // baseUrl for blob file uri (i.e. http://<accountName>.blob.core.windows.net/<container>/<blobname>),
      sasToken: // Shared access signature querystring key/value prefixed with ?,
      file: // File object using the HTML5 File API,
      progress: // progress callback function,
      complete: // complete callback function,
      error: // error callback function,
      blockSize: // Use this to override the DefaultBlockSize
    } */
    protected async uploadAsync(config: AzureConfig, resolver: (value?: boolean | PromiseLike<boolean>) => void, cancellationToken: CancellationToken = null) {
        this.events.emitStart();
        await config.loadUrlAsync();
        let state = this.initializeState(config);
        let ctx = this;
        let reader = new FileReader();
        reader.onloadend = (evt) => {
            if (cancellationToken && cancellationToken.cancel == true) {
                resolver(false);
            }
            if (evt.target["readyState"] === 2 /*FileReader.DONE*/ && !state.cancelled) { // DONE == 2
                let requestData = new Uint8Array(<any>evt.target["result"]);
                //$log.log(uri);
                //$http.defaults.headers.put["Content-Type"] = state.file.type;
                //$http.defaults.headers.put["x-ms-blob-type"] = 'BlockBlob';
                let comp = "&comp=block&blockid=" + state.blockIds[state.blockIds.length - 1];
                let uploadChunk = () => {
                    let uri = state.config.fileUrl + comp;
                    this.http.put(
                        uri,
                        requestData.buffer,
                        {
                            headers: {
                                "x-ms-blob-content-disposition": "attachment; filename=\"" + config.fileNameToDownloadAs + "\"",
                                "x-ms-blob-type": "BlockBlob",
                                "Content-Type": state.file.type,
                            },
                            observe: "response"
                        }).subscribe(result => {
                            if (cancellationToken && cancellationToken.cancel == true) {
                                resolver(false);
                            }
                            //$log.log(data);
                            //$log.log(status);
                            state.bytesUploaded += requestData.length;

                            let percentComplete = (+state.bytesUploaded / +state.file.size) * 100;
                            //ctx.onProgress.Emit(() => new IqlCdnUploadProgress(percentComplete))
                            this.events.emitProgress(percentComplete);

                            ctx.uploadFileInBlocks(reader, state, config, resolver, cancellationToken);
                        }, async error => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 403 && config.notAuthenticatedRetries < 10) {
                                    await config.loadUrlAsync();
                                    uploadChunk();
                                    return;
                                }
                            }
                            //$log.log(data);
                            //$log.log(status);

                            // if (state.error) state.error(data, status, headers, config);
                            resolver(false);
                        })
                        ;
                };
                uploadChunk();
            }
        };

        this.uploadFileInBlocks(reader, state, config, resolver, cancellationToken);

        return {
            cancel: function () {
                state.cancelled = true;
            }
        };
    }

    protected uploadFileInBlocks(reader, state, config: AzureConfig, resolver: (value?: boolean | PromiseLike<boolean>) => void, cancellationToken: CancellationToken) {
        if (state.cancelled || (cancellationToken != null && cancellationToken.cancel == true)) {
            resolver(false);
            return;
        }
        if (state.totalBytesRemaining > 0) {
            // IqlLoggerService.IfEnabled(() => IqlLoggerService.Log("current file pointer = " + state.currentFilePointer + " bytes read = " + state.maxBlockSize));

            let fileContent = state.file.slice(state.currentFilePointer, state.currentFilePointer + state.maxBlockSize);
            let blockId = state.blockIdPrefix + this.pad(state.blockIds.length, 6);
            //$log.log("block id = " + blockId);

            state.blockIds.push(btoa(blockId));
            reader.readAsArrayBuffer(fileContent);

            state.currentFilePointer += state.maxBlockSize;
            state.totalBytesRemaining -= state.maxBlockSize;
            if (state.totalBytesRemaining < state.maxBlockSize) {
                state.maxBlockSize = state.totalBytesRemaining;
            }
        } else {
            this.commitBlockList(state, config, resolver, cancellationToken);
        }
    }
}