import { Type } from "@bless/core";
import { IconTheme } from "./icon-theme";

export interface IconRegistrationParams {
  group: string;
  icon: string;
  key: string;
  overwriteExistingRegistration?: boolean;
  renderer?: string | Type<any>;
  theme?: IconTheme;
}
export class IconRegistration {
  public get renderer(): Type<any> {
    return this.rendererResolver();
  }

  constructor(
    public key: string,
    public group: string,
    public nativeName: string,
    private rendererResolver: () => Type<any>,
    public theme: IconTheme
  ) {}
}
