import { Publisher, TicketCreatedEvent, Subjects } from "@yvonnkr86pkgs/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
