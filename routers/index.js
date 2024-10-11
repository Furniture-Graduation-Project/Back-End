import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";

import routerCart from "./cart.js";
import CategoryRoute from "./category.js";
import routerComment from "./comment.js";
import routerEmployee from "./employee.js";
import routeMessage from "./message.js";
import orderRouter from "./order.js";
import productRouter from "./product.js";
import productItemRouter from "./productItem.js";
import routerPromotion from "./promotion.js";
import routerVoucher from "./voucher.js";
import routerWishlist from "./wishlist.js";
import routerBlog from "./blog.js";

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve("swagger.json"), "utf8")
);

export function Route(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/product", productRouter);
  app.use("/product-item", productItemRouter);
  app.use("/category", CategoryRoute);
  app.use("/order", orderRouter);
  app.use("/employee", routerEmployee);
  app.use("/blog", routerBlog);
  app.use("/wishlist", routerWishlist);
  app.use("/comment", routerComment);
  app.use("/cart", routerCart);
  app.use("/promotion", routerPromotion);
  app.use("/voucher", routerVoucher);
  app.use("/message", routeMessage);
}
