import { StatusCodes } from 'http-status-codes';
import Orders from '../models/order.js';
import Products from '../models/product.js';
import Categories from '../models/category.js';

export const StatisticalController = {
  getStatisticalFrom6MonthsAgo: async (req, res) => {
    try {
      // 1. Xác định khoảng thời gian 6 tháng gần nhất
      const now = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);

      const vietnameseMonths = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
      ];

      // 2. Truy vấn các đơn hàng trong khoảng thời gian đó
      const orders = await Orders.find({
        createdAt: { $gte: sixMonthsAgo, $lte: now },
      });

      if (!orders.length) {
        return res.status(StatusCodes.OK).json({
          message: 'Không có đơn hàng nào trong vòng 6 tháng gần nhất',
          data: [],
        });
      }

      // 3. Thống kê theo danh mục
      const categoryStats = {};

      for (const order of orders) {
        const monthIndex = order.createdAt.getMonth(); 
        const month = vietnameseMonths[monthIndex];  

        for (const item of order.items) {
          const product = await Products.findById(item.productId);
          if (product) {
            const category = await Categories.findById(product.category);
            if (category) {
              if (!categoryStats[month]) {
                categoryStats[month] = {};
              }

              if (!categoryStats[month][category.categoryName]) {
                categoryStats[month][category.categoryName] = 0;
              }

              categoryStats[month][category.categoryName] += 1;
            }
          }
        }
      }

      // 4. Định dạng dữ liệu trả về
      const chartData = Object.keys(categoryStats).map((month) => {
        const categories = categoryStats[month];
        return {
          month,
          ...categories,
        };
      });
      return res.status(StatusCodes.OK).json({
        message: 'Thống kê thành công',
        data: chartData,
      });
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Lỗi: ' + error.message,
      });
    }
  }
};
