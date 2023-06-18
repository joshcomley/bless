import { ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges, SimpleChanges } from "@angular/core";
import { nameof } from "@bless/core";
import { BaseComponentDirective } from "@bless/ng";
import { IconRegistration } from "@bless/platform";

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "bless-icon",
  templateUrl: "./icon.component.html",
  styleUrls: ["./icon.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent extends BaseComponentDirective implements OnChanges {
  @Input() public icon: string;
  @Input() public size: number = 10;
  @HostBinding("class") public get hostClass() {
    return this.iconMap?.group == "mi" ? "inline-flex" : "";
  }

  public iconMap: IconRegistration;

  public override ngOnChanges(changes: SimpleChanges): void {
    if (changes[nameof(() => this.icon)]) {
      this.iconMap = this.services.iconRegistry.getIcon(this.icon);
    }
  }

  public get nativeName(): string {
    return this.iconMap ? `${this.iconMap.group} ${this.iconMap.nativeName}` : "";
  }

  public get miSize(): number {
    return 2.4 * 0.83 * this.size;
  }
}
