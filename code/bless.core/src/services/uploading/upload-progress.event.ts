import { UploadEvent } from "./upload.event";
			
export class UploadProgressEvent<T> extends UploadEvent<T> {
    constructor(uploader: T, public percentage: number = 0) {
        super(uploader);
    }
}