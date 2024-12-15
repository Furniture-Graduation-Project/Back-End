import { Router } from "express";
import UserController from "../controllers/user.js";
const routerUser = Router();

routerUser.get("/", UserController.getAll);
routerUser.get("/count", UserController.countUser);
routerUser.get("/:id", UserController.getOne);
routerUser.delete("/:id", UserController.deleteUser);
routerUser.put("/:id", UserController.update);
routerUser.post("/send-otp", UserController.sendOtp);
routerUser.post("/verify-otp", UserController.verifyOtp);
routerUser.post("/change-password", UserController.newPassword);

export default routerUser;
