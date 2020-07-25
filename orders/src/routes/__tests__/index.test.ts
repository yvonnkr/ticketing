import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket, TicketDoc } from "../../models/ticket";

const buildTicket = async (title: string) => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title,
    price: 10,
  });
  await ticket.save();

  return ticket;
};

const createOrder = async (cookie: any, ticket: TicketDoc) => {
  return await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
};

it("fetches all orders for a particular user", async () => {
  // create 3 tickets and save to db
  const ticket1 = await buildTicket("concert");
  const ticket2 = await buildTicket("football");
  const ticket3 = await buildTicket("festival");

  const userOne = global.signin();
  const userTwo = global.signin();

  //create one order as User #1
  await createOrder(userOne, ticket1);

  //create two orders as User #2
  const { body: orderOne } = await createOrder(userTwo, ticket2);
  const { body: orderTwo } = await createOrder(userTwo, ticket3);

  //make request to get orders for User #2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .send()
    .expect(200);

  // assert that we only get the orders for User #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);

  expect(response.body[0].ticket.id).toEqual(ticket2.id);
  expect(response.body[1].ticket.id).toEqual(ticket3.id);
});
