import { Router } from "express";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployee,
  getDetailEmployee,
  editEmployee,
} from "../controllers/employee.js";

const routerEmployee = new Router();

routerEmployee.get("/employee", getAllEmployee);
routerEmployee.get("/employee/:id", getDetailEmployee);
routerEmployee.post("/employee", createEmployee);
routerEmployee.put("/employee/:id", editEmployee);
routerEmployee.delete("/employee/:id", deleteEmployee);

export default routerEmployee;
