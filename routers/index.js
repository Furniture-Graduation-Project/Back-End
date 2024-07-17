export function Route(app) {
  app.use("/api", () => {
    console.log("Server running");
  });
}
