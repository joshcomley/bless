import { TemplateRef } from "@angular/core";
import { StringService } from "@bless/core";
import { RenderTemplate, RenderTemplateKind } from "./render-template";

export class RenderTemplateIdentifier {
  public static IsEmpty(renderer: RenderTemplate): boolean {
    return typeof renderer === "string"
      ? StringService.IsNullOrWhiteSpace(renderer)
      : renderer == null;
  }

  public static IsComponentTemplate(renderer: RenderTemplate): boolean {
    return /^class\s/.test((renderer || "").toString());
  }

  public static IsLambdaTemplate(renderer: RenderTemplate): boolean {
    return (
      renderer != null &&
      typeof renderer === "function" &&
      !this.IsComponentTemplate(renderer)
    );
  }

  public static IsNoRenderTemplate(renderer: RenderTemplate) {
    return renderer === false;
  }

  // public static IsPropertyTemplate(renderer: RenderTemplate): boolean {
  //   return renderer != null && renderer instanceof PropertyPath;
  // }

  // public static IsNextTemplate(renderer: RenderTemplate): boolean {
  //   return renderer != null && renderer instanceof PropertyPath;
  // }

  public static IsTemplateRefTemplate(renderer: RenderTemplate): boolean {
    return renderer != null && renderer instanceof TemplateRef;
  }

  public static IsTextTemplate(renderer: RenderTemplate): boolean {
    return renderer != null && typeof renderer === "string";
  }

  public static ResolveTemplateKind(
    renderer: RenderTemplate
  ): RenderTemplateKind {
    if (this.IsTextTemplate(renderer)) {
      return RenderTemplateKind.text;
    }
    // if (this.IsPropertyTemplate(renderer)) {
    //   return RenderTemplateKind.property;
    // }
    if (this.IsComponentTemplate(renderer)) {
      return RenderTemplateKind.component;
    }
    if (this.IsLambdaTemplate(renderer)) {
      return RenderTemplateKind.lambda;
    }
    if (this.IsNoRenderTemplate(renderer)) {
      return RenderTemplateKind.noRender;
    }
    return null;
  }
}
