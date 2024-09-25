import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authToken = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  const token = authorizationHeader && authorizationHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
    console.log(err, data);
    if (err) return res.status(403).json({ message: "Token is not valid" });
    next();
  });
};

export default authToken;
