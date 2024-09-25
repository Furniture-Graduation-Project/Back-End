import express from 'express';
import VoucherController from '../controllers/voucher.js';

const routerVoucher = express.Router();

routerVoucher.post('/', VoucherController.create);
routerVoucher.get('/', VoucherController.getAll);
routerVoucher.get('/:id', VoucherController.getById);
routerVoucher.put('/:id', VoucherController.update);
routerVoucher.delete('/:id', VoucherController.delete);

export default routerVoucher;
