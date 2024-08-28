import express from 'express';
import {
  createVoucher,
  deleteVoucher,
  getVoucherById,
  getVouchers,
  updateVoucher,
} from '../controllers/voucher.js';
const routerVoucher = express.Router();

routerVoucher.post('/', createVoucher);
routerVoucher.get('/', getVouchers);
routerVoucher.get('/:id', getVoucherById);
routerVoucher.put('/:id', updateVoucher);
routerVoucher.delete('/:id', deleteVoucher);

export default routerVoucher;
