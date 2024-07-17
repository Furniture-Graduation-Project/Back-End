import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./utils/connect.js";
import { app, server } from "./services/socket.js";

import { Route } from "./routers/index.js";

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
