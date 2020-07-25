import React from "react";
import Router from "next/router";
import { useRequest } from "../../hooks/use-request";

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push(`/orders/[orderId]`, `/orders/${order.id}`),
  });

  return (
    <div className="card mt-5">
      <div className="card-body">
        <h2 style={{ textTransform: "capitalize" }} className="card-title">
          {ticket.title}
        </h2>
        <h4 className="card-text mb-5">Price: £ {ticket.price.toFixed(2)}</h4>
        {errors}
        <button className="btn btn-info" onClick={() => doRequest()}>
          Purchase
        </button>
      </div>
    </div>
  );
};

TicketShow.getInitialProps = async (ctx, client) => {
  const { ticketId } = ctx.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
