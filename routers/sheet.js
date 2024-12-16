import { Router } from "express";
import GoogleSheeetController from "../controllers/googleSheet.js";

const routerSheet = new Router();
routerSheet.post("/", GoogleSheeetController.write);
export default routerSheet;
