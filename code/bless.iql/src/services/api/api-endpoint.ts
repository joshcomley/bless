import { EnvironmentKind } from "./environment.kind";

export class ApiEndpoint {
    public get apiRoot(): string {
        let apiRoot = `${this.authority}://${this.host}`;
        if (this.port && this.port !== 80) {
            apiRoot += `:${this.port}`;
        }
        return apiRoot;
    }

    public get authority(): string {
        return `http${(this.ssl ? "s" : "")}`;
    }

    // eslint-disable-next-line getter-return
    public get ssl(): boolean {
        if (this.secure === true) {
            return true;
        }
        switch (this.environment) {
            case EnvironmentKind.Development:
                return false;
            case EnvironmentKind.Stage:
                return false;
            case EnvironmentKind.Live:
                return true;
        }
    }

    constructor(
        public key: string,
        public environment: EnvironmentKind,
        public host: string,
        public port: number,
        public secure: boolean | null = null) {
    }
}