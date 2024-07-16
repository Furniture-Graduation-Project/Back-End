import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./db/connect.js";
import { app, server } from "./socket/socket.js";

import { Route } from "./router/index.js";

dotenv.config();

const port = process.env.PORT || 3000;
const db = process.env.DB_URL;
connectDB(db);

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

Route(app);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
