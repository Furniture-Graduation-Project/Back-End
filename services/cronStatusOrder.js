import { CronJob } from 'cron';
import OrderModel from '../models/order.js';

const scheduleOrderStatusUpdate = () => {
  const job = new CronJob(
    '0 0 * * *',
    async () => {
      try {
        console.log('Đang kiểm tra và cập nhật trạng thái đơn hàng...');

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const result = await OrderModel.updateMany(
          {
            status: 'delivered',
            'statusHistory.status': 'delivered',
          },
          { $set: { status: 'received' } },
        );
        if (result.modifiedCount > 0) {
          console.log(result);

          console.log(
            `Đã cập nhật ${result.modifiedCount} đơn hàng sang trạng thái 'đã nhận hàng'.`,
          );
        } else {
          console.log('Không có đơn hàng nào cần cập nhật.');
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      }
    },
    null,
    false,
    'Asia/Ho_Chi_Minh',
  );
  job.start();
};

export default scheduleOrderStatusUpdate;
