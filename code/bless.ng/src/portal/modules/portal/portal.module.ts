import { PortalModule } from "@angular/cdk/portal";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BlessTextRendererModule, PortalComponent } from "../../components";
import { PortalService } from "../../services/portal";

@NgModule({
  declarations: [PortalComponent],
  exports: [PortalModule, PortalComponent],
  imports: [CommonModule, PortalModule, BlessTextRendererModule],
  providers: [PortalService],
})
export class BlessPortalModule {}
