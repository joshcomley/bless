import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Optional,
} from "@angular/core";
import { BLESS_PORTAL_CONTEXT, RenderContext } from "../../services";

@Component({
  selector: "bless-text-renderer",
  templateUrl: "./text-renderer.component.html",
  styleUrls: ["./text-renderer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextRendererComponent {
  constructor(
    @Optional() @Inject(BLESS_PORTAL_CONTEXT) public context: RenderContext
  ) {}
}
