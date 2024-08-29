import routerEmployee from './employee.js';
import routerReview from './review.js';
import productRouter from './product.js';
import CategoryRoute from './category.js';
import orderRouter from './order.js';
import routerWishlist from './wishlist.js';
import routerComment from './comment.js';
import routerPromotion from './promotion.js';
import routerVoucher from './voucher.js';
import routeMessage from './message.js';

export function Route(app) {
  app.use('/api', () => {
    console.log('Server running');
  });
  app.use('/product', productRouter);
  app.use('/category', CategoryRoute);
  app.use('/order', orderRouter);
  app.use('/employee', routerEmployee);
  app.use('/review', routerReview);
  app.use('/wishlist', routerWishlist);
  app.use('/comment', routerComment);
  app.use('/promotion', routerPromotion);
  app.use('/voucher', routerVoucher);
  app.use('/message', routeMessage);
}
