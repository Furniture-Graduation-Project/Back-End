import routerEmployee from "./employee.js";
import routerReview from "./review.js";

export function Route(app) {
  app.use("/api", routerEmployee);
  app.use("/api", routerReview);
}
