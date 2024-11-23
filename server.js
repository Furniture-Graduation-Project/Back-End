import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';

import './middleware/passport.js';
import { app, server } from './services/socket.js';
import { connectDB } from './utils/connect.js';
import { Route } from './routers/index.js';

dotenv.config();

const port = process.env.PORT || 3000;

const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_URL];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SECRET_KEY));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      sameSite: process.env.SAME_SITE,
      secure: process.env.NODE_ENV !== 'development',
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

connectDB(process.env.DB_URL);

Route(app);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
