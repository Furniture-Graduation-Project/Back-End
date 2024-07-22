import productRouter from "./product.js";
import CategoryRoute from "./category.js";

export function Route(app) {
  app.use("/api", () => {
    console.log("Server running");
  });
  app.use('/product', productRouter)
  app.use('/category', CategoryRoute)
}
