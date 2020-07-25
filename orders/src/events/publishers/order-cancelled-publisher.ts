import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from "@yvonnkr86pkgs/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
