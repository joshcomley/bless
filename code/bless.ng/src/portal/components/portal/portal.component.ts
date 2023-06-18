import { ComponentPortal } from "@angular/cdk/portal";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  StaticProvider,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core";
import { ArrayOrSingle, GuidService, nameof } from "@bless/core";
import {
  IRenderContainer,
  LambdaRenderTemplate,
  PortalService,
  RenderContext,
  RendererDefinition,
  RenderRegistration,
  RenderTemplate,
  RenderTemplateBuilder,
  RenderTemplateIdentifier,
} from "../../services";
import { TextRendererComponent } from "../text-renderer";
import { NextTemplate } from "./next-template";
import { TemplateRendererCache } from "./portal-cache.service";
import { RenderFinder } from "../../services/renderer-finder/renderer-finder";

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "bless-portal",
  templateUrl: "./portal.component.html",
  styleUrls: ["./portal.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PortalService],
})
export class PortalComponent implements OnChanges, OnInit {
  @Input() public context: any;
  @Input() public debug: any;
  @Input() public entity: any;
  @Input() public key: any;
  @Input() public portalKey: any;
  @Input() public metadata: IRenderContainer;
  @Input() public propertyTemplate: RenderTemplate = null;
  @Input() public renderKeys: ArrayOrSingle<string>;
  @Input() public scopeKeys: ArrayOrSingle<string>;
  @Input() public sender: any;
  @Input() public template: RenderTemplate | NextTemplate = null;
  @Input() public unresolvedTemplate: RenderTemplate = null;
  @Input() public renderContextInternal = null;
  @Input() public providers: Array<StaticProvider> = null;

  private _renderContext: RenderContext = null;
  private inferredTemplates: NextTemplate[] = null;
  hasInit: boolean;

  public get isComponent(): boolean {
    return RenderTemplateIdentifier.IsComponentTemplate(
      this.renderContext.template
    );
  }

  public get isLambda(): boolean {
    return RenderTemplateIdentifier.IsLambdaTemplate(
      this.renderContext.template
    );
  }

  // public get isProperty(): boolean {
  //   return RenderTemplateIdentifier.IsPropertyTemplate(
  //     this.renderContext.template
  //   );
  // }

  public get isString(): boolean {
    return RenderTemplateIdentifier.IsTextTemplate(this.renderContext.template);
  }

  public get isTemplate(): boolean {
    return RenderTemplateIdentifier.IsTemplateRefTemplate(
      this.renderContext.template
    );
  }

  public get portal(): ComponentPortal<any> {
    this.portalKey ??= GuidService.New();
    return this.cache.getOrCreate(this.portalKey, () => {
      let portalBuilder = new RenderTemplateBuilder(this.portalService);
      return portalBuilder.buildPortal(
        new RendererDefinition(
          RenderTemplateIdentifier.IsLambdaTemplate(
            this.resolvedTemplate.definition?.template
          )
            ? TextRendererComponent
            : this.resolvedTemplate.definition?.template
        ),
        this.renderContext,
        this.injector,
        this.vcr,
        this.providers
      );
    });
  }

  public get renderContext(): RenderContext {
    if (this.template instanceof NextTemplate) {
      return this.template.context;
    }
    return (
      this.renderContextInternal ??
      (this._renderContext ??= this.buildRenderContext().renderContext)
    );
  }

  public get inferredTemplate(): NextTemplate {
    return this.inferredTemplates?.length > 0
      ? this.inferredTemplates[0]
      : null;
  }

  public get resolvedTemplate(): NextTemplate {
    if (this.inferredTemplate) {
      return this.inferredTemplate;
    }
    if (this.template instanceof NextTemplate) {
      return new NextTemplate(
        this.template?.definition ??
        new RendererDefinition(this.unresolvedTemplate),
        () => this.renderContext
      );
    }
    return new NextTemplate(
      new RendererDefinition(this.template ?? this.unresolvedTemplate),
      () => this.renderContext
    );
  }

  public get templateAsTemplateRef(): TemplateRef<any> {
    return this.renderContext.template as TemplateRef<any>;
  }

  constructor(
    private injector: Injector,
    private portalService: PortalService,
    private cdr: ChangeDetectorRef,
    private render: RenderRegistration,
    private cache: TemplateRendererCache,
    private vcr: ViewContainerRef,
    private rendererFinder: RenderFinder
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      ((!this.template) &&
        (changes[nameof(() => this.renderKeys)] ||
          changes[nameof(() => this.scopeKeys)] ||
          changes[nameof(() => this.metadata)])) ||
      changes[nameof(() => this.template)] ||
      changes[nameof(() => this.unresolvedTemplate)] ||
      changes[nameof(() => this.propertyTemplate)] ||
      changes[nameof(() => this.context)]
    ) {
      this.updateInferredTemplate();
    }
  }

  public ngOnInit(): void {
    this.hasInit = true;
    this.cdr.detectChanges();
  }

  private buildRenderContext<TSender = any>() {
    let rawValue;
    let renderer = this.resolvedTemplate;
    const getContext = (next: NextTemplate) => {
      const ctx = new RenderContext(
        () => next.next,
        () => this.context
      );
      ctx.renderer = next.definition;
      ctx.sender = this.sender;
      ctx.value = rawValue;
      ctx.template = next.definition.template;
      return ctx;
    };
    let isTextTemplate = false;
    while (true) {
      const template = renderer?.definition?.template;
      if (template == null) {
        break;
      }
      // if (RenderTemplateIdentifier.IsPropertyTemplate(template)) {
      //   isTextTemplate = true;
      //   break;
      // } else
      if (RenderTemplateIdentifier.IsTextTemplate(template)) {
        isTextTemplate = true;
        rawValue = template as string;
        break;
      } else if (RenderTemplateIdentifier.IsLambdaTemplate(template)) {
        const result = (template as LambdaRenderTemplate)(getContext(renderer));
        if (result instanceof NextTemplate) {
          renderer = result;
        } else if (result === undefined) {
          renderer = renderer.next;
        } else {
          break;
        }
      } else {
        break;
      }
    }
    const renderContext = getContext(this.resolvedTemplate);
    return { isTextTemplate, renderContext };
  }

  private updateInferredTemplate(): void {
    if (this.template instanceof NextTemplate) {
      this.inferredTemplates = [this.template];
    } else {
      this.inferredTemplates = (
        this.rendererFinder.findRenderers(
          [this.metadata, this.render],
          this.context,
          this.renderKeys,
          this.scopeKeys,
          this.entity
        ) ?? []
      ).map(_ => new NextTemplate(_, () => this.renderContext));
      if (this.template) {
        this.inferredTemplates = [
          new NextTemplate(
            new RendererDefinition(this.template),
            () => this.renderContext
          ),
          ...this.inferredTemplates,
        ];
      }
      // // JC: Keep this here
      // if (this.key === "bless-form") {
      //   debugger;
      // }
      if (this.unresolvedTemplate) {
        this.inferredTemplates.push(
          new NextTemplate(
            {
              context: null,
              if: null,
              keys: this.renderKeys.slice(),
              nickname: null,
              scope: null,
              priority: 0,
              template: this.unresolvedTemplate,
            },
            () => this.renderContext
          )
        );
      }
      for (let i = 0; i < this.inferredTemplates.length; i++) {
        const cur = this.inferredTemplates[i];
        cur.getContext = () => {
          const cur2 = cur;
          const context = new RenderContext(
            () => cur2.next,
            () => this.renderContext.context
          );
          context.sender = this.renderContext.sender;
          context.renderer = cur2.definition;
          context.value = this.renderContext.value;
          context.template = cur2.definition.template;
          return context;
        };

        cur.next = this.inferredTemplates[i + 1];
      }
    }
    this.cdr.detectChanges();
  }
}
