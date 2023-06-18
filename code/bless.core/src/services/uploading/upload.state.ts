export class UploadState {
    public isComplete: boolean = false;
    public progress: number = 0;

    constructor(
        public key: string,
        public url: string,
        public fileName: string,
        public contentType: string,
        public downloadFileName: string) {
    }
}