import express from "express";
import cookieSession from "cookie-session";
require("express-async-errors");

import { json } from "body-parser";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@yvonnkr86pkgs/common";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes";
import { deleteOrderRouter } from "./routes/delete";

const app = express();
app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
    // secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
