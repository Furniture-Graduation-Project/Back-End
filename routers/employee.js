import { Router } from "express";
import EmployeeController from "../controllers/employee.js";
const routerEmployee = new Router();

routerEmployee.get("/", EmployeeController.getAll);
routerEmployee.get("/search", EmployeeController.searchByFullName);
routerEmployee.get("/limited", EmployeeController.getLimited);
routerEmployee.get("/:id", EmployeeController.getDetail);
routerEmployee.post("/", EmployeeController.create);
routerEmployee.put("/:id", EmployeeController.update);
routerEmployee.delete("/:id", EmployeeController.delete);
routerEmployee.post("/signin", EmployeeController.signin);

export default routerEmployee;
