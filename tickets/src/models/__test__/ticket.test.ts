import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async (done) => {
  // create an instance of a Ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 10,
    userId: "user123",
  });
  // save the ticket to the database
  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 100 });
  secondInstance!.set({ price: 200 });

  // save the first fetched ticket
  await firstInstance!.save();

  //   console.log(ticket);
  //   console.log(firstInstance);
  //   console.log(secondInstance);

  // save the second fetched ticket and expect an error as version should have been increamented already
  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }

  throw new Error("Should not reach this point");
});

it("increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 10,
    userId: "user123",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
