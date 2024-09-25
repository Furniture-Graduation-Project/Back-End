import { Router } from 'express';
import CommentController from '../controllers/comment.js';

const routerComment = new Router();

routerComment.get('/', CommentController.getAll);
routerComment.get('/:id', CommentController.getDetail);
routerComment.post('/', CommentController.create);
routerComment.put('/:id', CommentController.edit);
routerComment.delete('/', CommentController.delete);

export default routerComment;
