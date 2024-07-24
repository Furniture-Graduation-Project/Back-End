import authRoutes from "./passport.js";
import locationRoutes from "./location.js";
import routerEmployee from "./employee.js";
import routerReview from "./review.js";
import productRouter from "./product.js";
import CategoryRoute from "./category.js";
import orderRouter from "./order.js";
import routerWishlist from "./wishlist.js";

export function Route(app) {
    app.use("/api", () => {
        console.log("Server running");
    });

    app.use("/product", productRouter);
    app.use("/category", CategoryRoute);
    app.use("/order", orderRouter);
    app.use("/employee", routerEmployee);
    app.use("/review", routerReview);
    app.use("/wishlist", routerWishlist);
    app.use("/locations", locationRoutes);
    app.use("/", authRoutes);
}
