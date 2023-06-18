import { NotificationKind } from "./notifier.kind";

export class NotifierMessage {
  constructor(
    public message: string,
    public title: string = null,
    public kind: NotificationKind = NotificationKind.info,
    public view?: any
  ) {}

  public static Flatten(message: string | NotifierMessage): NotifierMessage {
    if (message == null) {
      message = "";
    }
    if (typeof message !== "object") {
      return new NotifierMessage(message, "");
    }
    return message;
  }
}
