import React, { useEffect, useState } from "react";
import Router from "next/router";
import StripeCheckout from "react-stripe-checkout";
import { useRequest } from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
      //token passed in as props to doRequest()
    },
    onSuccess: () => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    // initial call
    findTimeLeft();

    //setInterval to call fn every 1sec
    const timerId = setInterval(findTimeLeft, 1000);

    //cleanup fn to stop-setTimeout
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      <h3>Time left to pay: {timeLeft} seconds </h3>
      <StripeCheckout
        token={(token) => doRequest({ token: token.id })}
        stripeKey="pk_test_MF02NnSeScOfjKUvmKoPAy7D00QBseCWVm"
        amount={order.ticket.price * 100}
        currency="GBP"
        email={currentUser.email}
      />
      {errors}
      <br />
      <p>Test Card: 4242 4242 4242 4242 , Any future date / Any CVC </p>
    </div>
  );
};

OrderShow.getInitialProps = async (ctx, client) => {
  const { orderId } = ctx.query;

  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
