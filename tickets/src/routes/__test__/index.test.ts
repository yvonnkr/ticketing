import request from "supertest";
import { app } from "../../app";

const createTicket = async (title: string, price: number) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price })
    .expect(201);
};

it("can fetch a list of tickets", async () => {
  await createTicket("testtitle1", 10);
  await createTicket("testtitle2", 20);
  await createTicket("testtitle3", 30);

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
