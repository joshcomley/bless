import { Subject } from "rxjs";
import { NotifierMessage } from "./notifier-message.model";
import { NotificationKind } from "./notifier.kind";

export interface INotifierEvent {
  message: NotifierMessage;
  kind: NotificationKind;
}

export class NotifierService {
  public messageReceived = new Subject<INotifierEvent>();

  public error(message: string | NotifierMessage): void {
    message = NotifierMessage.Flatten(message);
    // this.logger.error("Error: " + message.message, message.title);
    this.launch(message, NotificationKind.error);
  }

  public info(message: string | NotifierMessage): void {
    message = NotifierMessage.Flatten(message);
    // this.logger.info("Info: " + message.message, message.title);
    this.launch(message, NotificationKind.info);
  }

  public launch(message: NotifierMessage, kind?: NotificationKind): void {
    kind ??= message.kind || NotificationKind.info;
    this.messageReceived.next({
      message,
      kind
    });
  }

  public log(message: string | NotifierMessage): void {
    // if (isDevMode()) {
    //   message = NotifierMessage.Flatten(message);
    //   // this.logger.info("Success: " + message.message, message.title);
    //   this.launch(message, NotificationKind.info);
    // }
  }

  public success(message: string | NotifierMessage): void {
    message = NotifierMessage.Flatten(message);
    // this.logger.info("Success: " + message.message, message.title);
    this.launch(message, NotificationKind.success);
  }

  public warning(message: string | NotifierMessage): void {
    message = NotifierMessage.Flatten(message);
    // this.logger.warning("Warning: " + message.message, message.title);
    this.launch(message, NotificationKind.warning);
  }
}
