import { Router } from "express";
import passport from "passport";
const router = Router();
import AuthController from "../controllers/auth.js";
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  AuthController.signinGoogle
);

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/auth/failure" }),
  AuthController.signinFacebook
);

router.get("/auth/failure", (req, res) => {
  res.send("Failed");
});

const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.send("Not logged in");
};

router.get(process.env.CLIENT_URL, isLoggedIn, (req, res) => {
  res.send(`Welcome ${req.user.name}`);
});

router.post("/signup", AuthController.signup);
router.post("/signin", AuthController.signin);
router.put("/update/:id", AuthController.update);
router.post("/refreshToken", AuthController.refreshToken);
router.post("/logout", AuthController.logout);

export default router;
