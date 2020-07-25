import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from "@yvonnkr86pkgs/common";

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
