import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "./controllers/passport.js";
import { app, server } from "./services/socket.js";

import { connectDB } from "./utils/connect.js";
import { Route } from "./routers/index.js";

dotenv.config();

const port = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB(process.env.DB_URL);

Route(app);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
