import { Router } from 'express';
import passport from 'passport';
const router = Router();
import AuthController from '../controllers/auth.js';
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/failure',
  }),
);

router.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] }),
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/protected',
    failureRedirect: '/auth/failure',
  }),
);

router.get('/auth/failure', (req, res) => {
  res.send('Failed');
});

const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.send('Not logged in');
};

router.get('/protected', isLoggedIn, (req, res) => {
  res.send(`Welcome ${req.user.name}`);
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    req.session.destroy();
    res.send('Logged out');
  });
});

router.post('/signup', AuthController.signup);
router.post('/signin', AuthController.signin);
router.put('/update/:id', AuthController.update);
router.post('/refreshToken', AuthController.refreshToken);
router.post('/logout', AuthController.logout);

export default router;
