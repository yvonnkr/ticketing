import { Message } from "node-nats-streaming";
import { Listener, Subjects, OrderCreatedEvent } from "@yvonnkr86pkgs/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // if no ticket throw error
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });

    // save the ticket
    await ticket.save();

    // emit event that ticket was updated
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    // ack the msg
    msg.ack();
  }
}
