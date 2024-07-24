import { Router } from "express";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployee,
  getDetailEmployee,
  editEmployee,
} from "../controllers/employee.js";

const routerEmployee = new Router();

routerEmployee.get("/", getAllEmployee);
routerEmployee.get("/:id", getDetailEmployee);
routerEmployee.post("/", createEmployee);
routerEmployee.put("/:id", editEmployee);
routerEmployee.delete("/:id", deleteEmployee);

export default routerEmployee;
