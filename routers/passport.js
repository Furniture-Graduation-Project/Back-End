import { Router } from "express";
import passport from "passport";
import {
  deleteUser,
  getAll,
  getOne,
  logout,
  refreshToken,
  signin,
  signup,
  update,
} from "../controllers/auth.js";

const router = Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure",
  })
);

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure",
  })
);

router.get("/auth/failure", (req, res) => {
  res.send("Failed");
});

const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.send("Not logged in");
};

router.get("/protected", isLoggedIn, (req, res) => {
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

router.post("/signup", signup);
router.post("/signin", signin);
router.put("/update/:id", update);
router.get("/users", getAll);
router.get("/users/:id", getOne);
router.delete("/users/:id", deleteUser);
router.post("/refreshToken", refreshToken);
router.post("/logout", logout);

export default router;
