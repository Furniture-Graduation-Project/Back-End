import { CronJob } from 'cron';
import OrderModel from '../models/order.js';

const scheduleOrderStatusUpdate = () => {
  const job = new CronJob(
    '0 0 * * *',
    async () => {
      try {
        console.log('Running order status check...');

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const ordersToUpdate = await OrderModel.find({
          status: 'delivered',
          deliveredAt: { $lte: sevenDaysAgo },
        });

        if (ordersToUpdate.length > 0) {
          await OrderModel.updateMany(
            {
              _id: { $in: ordersToUpdate.map((order) => order._id) },
            },
            { $set: { status: 'received' } },
          );
          console.log(`Updated ${ordersToUpdate.length} orders to 'received'.`);
        } else {
          console.log('No orders to update.');
        }
      } catch (error) {
        console.error('Error updating order statuses:', error);
      }
    },
    null,
    false,
    'UTC',
  );
  job.start();
};

export default scheduleOrderStatusUpdate;
