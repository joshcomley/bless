import { Observable } from "rxjs";

export type AsyncType<T> = T | Promise<T> | Observable<T>;