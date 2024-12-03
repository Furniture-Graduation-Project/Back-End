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
  (req, res) => {
    const token = AuthController.generateToken(req.user);
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  }
);

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    const token = AuthController.generateToken(req.user);
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  }
);

router.get("/auth/failure", (req, res) => {
  res.send("Failed");
});

const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.send("Not logged in");
};

router.get("http://localhost:5173", isLoggedIn, (req, res) => {
  res.send(`Welcome ${req.user.name}`);
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    req.session.destroy();
    res.send("Logged out");
  });
});

router.post("/signup", AuthController.signup);
router.post("/signin", AuthController.signin);
router.put("/update/:id", AuthController.update);
router.post("/refreshToken", AuthController.refreshToken);
router.post("/logout", AuthController.logout);

export default router;
