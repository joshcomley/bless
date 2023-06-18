import { CommonModule } from "@angular/common";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { IconComponent } from "./icon.component";

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [IconComponent],
  exports: [IconComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class IconRendererModule { }
