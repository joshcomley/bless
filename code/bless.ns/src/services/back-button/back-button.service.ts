import { BackButtonServiceBase } from "@bless/platform";
import { isAndroid } from "@nativescript/core";
import { android, AndroidActivityBackPressedEventData, AndroidApplication } from "@nativescript/core/application";
import { Frame } from "@nativescript/core/ui/frame";
import { BackButtonEvent } from '../../../../bless.platform/src/services/back-button/back-button.service';

export class BackButtonService extends BackButtonServiceBase {
    private _hasInit = false;
    private _skipNext = false;

    public dispose() {
        if (isAndroid) {
            android.off(AndroidApplication.activityBackPressedEvent, this.handleBackButton_);
        }
    }

    protected goBack() {
        Frame.topmost().android.currentActivity.onBackPressed();
    }

    public init(): void {
        if (this._hasInit) {
            return;
        }
        this._hasInit = true;
        if (isAndroid) {
            android.on(AndroidApplication.activityBackPressedEvent, this.handleBackButton_);
        }
    }

    private async checkOk() {
        const ok = await confirm("You sure?");
        if (ok === true) {
            if (isAndroid) {
                this._skipNext = true;
                this.goBack();
                // Frame.topmost().currentPage.onBackPressed();
            }
        }
    }

    private handleBackButton(data: AndroidActivityBackPressedEventData) {
        if (!this._skipNext) {
            const ev = {
                cancel: false
            } as BackButtonEvent;
            this.onBackButton.next(ev);
            data.cancel = ev.cancel;

            // setTimeout(() => {
            //     this.checkOk();
            // }, 100);
        } else {
            this._skipNext = false;
        }
    }

    private handleBackButton_ = (_) => this.handleBackButton(_);
}