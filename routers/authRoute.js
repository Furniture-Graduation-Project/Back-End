import authRoutes from "./passport.js";

export function AuthRoute(app) {
  app.use("/api", () => {
    console.log("Auth Server running");
  });
  app.use("/", authRoutes);
}
