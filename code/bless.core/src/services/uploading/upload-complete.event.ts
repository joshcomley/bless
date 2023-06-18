import { UploadEvent } from "./upload.event";
			
export class UploadCompleteEvent<T> extends UploadEvent<T> {
    constructor(uploader: T, public success: boolean) {
        super(uploader);
    }
}