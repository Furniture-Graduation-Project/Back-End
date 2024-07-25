import { StatusCodes } from "http-status-codes";

const errorHandler = (err, req, res, next) => {
  const statusCode =
    res.statusCode !== 200 ? res.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};

export default errorHandler;
