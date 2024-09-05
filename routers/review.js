import { Router } from 'express';
import ReviewController from '../controllers/review.js';

const routerReview = new Router();
routerReview.get('/', ReviewController.getAll);
routerReview.get('/:id', ReviewController.getById);
routerReview.post('/', ReviewController.create);
routerReview.put('/:id', ReviewController.update);
routerReview.get('/:id', ReviewController.delete);
export default routerReview;
