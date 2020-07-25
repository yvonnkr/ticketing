import { Publisher, TicketUpdatedEvent, Subjects } from "@yvonnkr86pkgs/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
