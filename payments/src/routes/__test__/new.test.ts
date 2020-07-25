import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@yvonnkr86pkgs/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

// jest.mock("../../stripe.ts");

it("throws a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "kjhjhjkhj",
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("throws a 401 when purchasing an order that does not belong to the user", async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: mongoose.Types.ObjectId().toHexString(),
    price: 10,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "kjhjhjkhj",
      orderId: order.id,
    })
    .expect(401);
});

it("throws a 400 when purchasing a cancelled order", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: userId,
    price: 10,
    status: OrderStatus.Created,
  });
  await order.save();

  order.set({ status: OrderStatus.Cancelled });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "kjhjhjkhj",
      orderId: order.id,
    })
    .expect(400);
});

//testing stripe using a mock fn  (--mark stripe.ts.old to test and un-coment env var in setup) --real test below
/*
it("returns a 201 with valid inputs & make stripe charge", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: userId,
    price: 10,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  // console.log(chargeOptions);

  expect(stripe.charges.create).toHaveBeenCalled();
  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(order.price * 100);
  expect(chargeOptions.currency).toEqual("gbp");
});

*/

//test stripe with direct call to stripe api --add env var in setup
/*
it("returns a 201 with valid inputs & make stripe charge", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const randomPrice = Math.floor(Math.random() * 1000);

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: userId,
    price: randomPrice,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find(
    (charge) => charge.amount === randomPrice * 100
  );

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual("gbp");
  expect(stripeCharge!.amount).toEqual(randomPrice * 100);

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });

  expect(payment).not.toBeNull();
})

*/
