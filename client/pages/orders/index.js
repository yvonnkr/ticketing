import React from "react";

const OrderIndex = ({ orders }) => {
  return (
    <div>
      <h1>All my orders</h1>
      <ul className="list-group">
        {orders.map((order) => {
          return (
            <li key={order.id} className="list-group-item">
              Title: {order.ticket.title} - Status: {order.status}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

OrderIndex.getInitialProps = async (ctx, client) => {
  const { data } = await client.get("/api/orders");

  return { orders: data };
};

export default OrderIndex;
