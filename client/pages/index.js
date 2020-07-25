import { buildClient } from "../api/build-client";
import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td style={{ textTransform: "capitalize" }}>{ticket.title}</td>
        <td>£{ticket.price.toFixed(2)}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a className="btn btn-outline-secondary">View</a>
          </Link>
        </td>
      </tr>
    );
  });
  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (ctx, client, currentUser) => {
  const { data } = await client.get("/api/tickets");

  return { tickets: data };

  //#region fetched user in _app.js instead
  // const client = buildClient(ctx);
  // const { data } = await client.get("/api/users/currentuser");

  // return data;
  //#endregion

  //#region before using configured axios
  /*
  //FORMAT ------http://ServiceName.Namespace.svc.cluster.local/------------

        if (typeof window === "undefined") {
          
          const { data } = await axios.get(
            "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
            {
              headers: req.headers,
            }
          );
          console.log("on server", data);
          return data;
        } else {
          const { data } = await axios.get("/api/users/currentuser");

          console.log("on client", data);
          return data;
        }
  */
  //#endregion
};

export default LandingPage;
