import express from "express";
import { MessageController } from "../controllers/message.js";

const routeMessage = express.Router();

routeMessage.get("/", MessageController.getAll);
routeMessage.get("/limited", MessageController.getLimited);
routeMessage.get("/:id", MessageController.getById);
routeMessage.get("/user/:id", MessageController.getByUser);
routeMessage.get("/label/:label", MessageController.getByLabel);
routeMessage.get("/category/:category", MessageController.getByCategory);
routeMessage.get("/status/:status", MessageController.getByStatus);
routeMessage.get("/star", MessageController.getByStar);
routeMessage.post("/", MessageController.createConversation);
routeMessage.put("/:id", MessageController.updateConversation);
routeMessage.put("/user/:id", MessageController.addMessage);
routeMessage.delete("/:id", MessageController.delete);

export default routeMessage;
