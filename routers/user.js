import { Router } from 'express';
import UserController from '../controllers/user.js';
const routerUser = Router();
routerUser.get('/', UserController.getAll);
routerUser.get('/count', UserController.countUser);
routerUser.get('/:id', UserController.getOne);
routerUser.delete('/:id', UserController.deleteUser);

export default routerUser;
