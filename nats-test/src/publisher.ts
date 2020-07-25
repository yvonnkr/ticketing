import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

//stan(nats in-reverse) is just a naming convention --can be named client

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: "123456",
      title: "testtitle",
      price: 30,
    });
  } catch (err) {
    console.error(err);
  }

  //#region before using class
  // const data = {
  //   id: "12345",
  //   title: "concert 2",
  //   price: 20,
  // };

  // stan.publish("ticket:created", data, () => {
  //   console.log("Event published");
  // });
  //#endregion
});
