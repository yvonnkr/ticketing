import {
  Publisher,
  PaymentCreatedEvent,
  Subjects,
} from "@yvonnkr86pkgs/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
