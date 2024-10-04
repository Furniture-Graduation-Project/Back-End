import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";
import "./controllers/passport.js";
import { app, server } from "./services/socket.js";

import { AuthRoute } from "./routers/authRoute.js";
import { connectDB } from "./utils/connect.js";
dotenv.config();

const port = process.env.AUTH_PORT || 5500;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB(process.env.DB_URL);

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send(
    '<a href="/auth/google">Login with Google</a><br><a href="/auth/facebook">Login with Facebook</a>'
  );
});

AuthRoute(app);

server.listen(port, () => {
  console.log(`Auth Server running on http://localhost:${port}`);
});
