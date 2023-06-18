import { UploadEvent } from "./upload.event";
			
export class UploadStartEvent<T> extends UploadEvent<T> {
    constructor(uploader: T) {
        super(uploader);
    }
}