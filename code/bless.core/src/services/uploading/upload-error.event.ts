import { UploadEvent } from "./upload.event";
			
export class UploadErrorEvent<T> extends UploadEvent<T> {
    constructor(uploader: T, public message: string = "") {
        super(uploader);
    }
}