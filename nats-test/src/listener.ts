import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());

//#region before creating classes
/**
 * stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName("order-service-durable-name");

  const subscription = stan.subscribe(
    "ticket:created",
    "order-service-queue-group",
    options
  );

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    console.log(`Received event #${msg.getSequence()}, With data: ${data}`);

    msg.ack();
  });
});

 */
//#endregion

//#region TODO before start.....
/** --- SPLIT TERMINAL ----
 * skaffold dev
 * k port-forward <pod>  4222:4222
 * k port-forward <pod>  8222:8222
 * npm run publish *1
 * npm run listen *2
 */

//http://localhost:8222/streaming
//http://localhost:8222/streaming/clientsz?subs=1
//#endregion
