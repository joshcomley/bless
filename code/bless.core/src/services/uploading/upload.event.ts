export abstract class UploadEvent<T> {
    constructor(public uploader: T) {
    }
}