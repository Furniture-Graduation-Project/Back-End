import { Router } from 'express';
import {
  create,
  getByUserId,
  remove,
  update,
} from '../controllers/location.js';
import { getAllLocation } from '../services/locations.js';

const router = Router();

router.get('/', getAllLocation);
router.post('/:userId', create);
router.get('/:userId', getByUserId);
router.delete('/:locationsId', remove);
router.put('/:id', update);

export default router;
