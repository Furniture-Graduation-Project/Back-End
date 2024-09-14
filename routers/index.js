import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

import routerEmployee from './employee.js';
import routerReview from './review.js';
import productRouter from './product.js';
import CategoryRoute from './category.js';
import orderRouter from './order.js';
import routerWishlist from './wishlist.js';
import routerComment from './comment.js';
import routerCart from './cart.js';
import routerPromotion from './promotion.js';
import routerVoucher from './voucher.js';
import authRoutes from './user.js';
import routeMessage from './message.js';
import productItemRouter from './productItem.js';

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve('swagger.json'), 'utf8'),
);

export function Route(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/product', productRouter);
  app.use('/product-item', productItemRouter);
  app.use('/category', CategoryRoute);
  app.use('/order', orderRouter);
  app.use('/employee', routerEmployee);
  app.use('/review', routerReview);
  app.use('/wishlist', routerWishlist);
  app.use('/comment', routerComment);
  app.use('/cart', routerCart);
  app.use('/promotion', routerPromotion);
  app.use('/voucher', routerVoucher);
  app.use('/auth', authRoutes);
  app.use('/message', routeMessage);
}
