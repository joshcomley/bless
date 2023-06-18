import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TextRendererComponent } from "./text-renderer.component";

@NgModule({
  declarations: [TextRendererComponent],
  imports: [CommonModule],
  exports: [TextRendererComponent],
})
export class BlessTextRendererModule {}
