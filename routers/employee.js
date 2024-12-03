import { Router } from "express";
import EmployeeController from "../controllers/employee.js";
import protectRoute from "../middleware/protectRoute.js";
import protectSupport from "../middleware/protectSupport.js";
import protectAdmin from "../middleware/protectAdmin.js";
const routerEmployee = new Router();

routerEmployee.get(
  "/",
  protectRoute,
  protectSupport,
  EmployeeController.getAll
);
routerEmployee.get("/search", EmployeeController.searchByFullName);
routerEmployee.get("/limited", EmployeeController.getLimited);
routerEmployee.get("/:id", EmployeeController.getDetail);
routerEmployee.post("/", protectRoute, protectAdmin, EmployeeController.create);
routerEmployee.post("/refreshToken", EmployeeController.refreshToken);
routerEmployee.post("/logout", EmployeeController.logout);
routerEmployee.put("/:id", protectRoute, EmployeeController.update);
routerEmployee.put("/password/:id", EmployeeController.updatePassword);
routerEmployee.delete(
  "/:id",
  protectRoute,
  protectAdmin,
  EmployeeController.delete
);
routerEmployee.post("/signin", EmployeeController.signin);

export default routerEmployee;
