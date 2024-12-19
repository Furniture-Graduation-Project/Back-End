import { StatusCodes } from "http-status-codes";
import Orders from "../models/order.js";
import Products from "../models/product.js";
import Categories from "../models/category.js";
import CategoryModel from "../models/category.js";
import ProductItemModel from "../models/productItem.js";

export const StatisticalController = {
  getStatisticalFrom6MonthsAgo: async (req, res) => {
    try {
      const now = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 5);
  
      const vietnameseMonths = [
        "Tháng 1", "Tháng 2", "Tháng 3", 
        "Tháng 4", "Tháng 5", "Tháng 6", 
        "Tháng 7", "Tháng 8", "Tháng 9", 
        "Tháng 10", "Tháng 11", "Tháng 12"
      ];
  
      const recentMonths = [];
      for (let i = 0; i < 6; i++) {
        const date = new Date();
        date.setMonth(now.getMonth() - i);
        const monthName = vietnameseMonths[date.getMonth()];
        recentMonths.unshift(monthName);
      }
      const orders = await Orders.find({
        createdAt: { $gte: sixMonthsAgo, $lte: now },
        status: "received",
      });
      const categoryStats = {};
      recentMonths.forEach((month) => {
        categoryStats[month] = {};
      });
  
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

      const chartData = recentMonths.map((month) => {
        const categories = categoryStats[month] || {};
        return {
          month,
          ...categories
        };
      });
  
      return res.status(StatusCodes.OK).json({
        message: "Thống kê thành công",
        data: chartData,
      });
  
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Lỗi: " + error.message,
      });
    }
  },
  

  getStatisticalFrom6MonthsAgoPieChart: async (req, res) => {
    try {
      const now = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);

      const vietnameseMonths = [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ];
      const monthlyStats = {};
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(now.getMonth() - i);
        const monthIndex = date.getMonth();
        monthlyStats[vietnameseMonths[monthIndex]] = 0;
      }

      // Truy vấn các đơn hàng trong khoảng thời gian đó
      const orders = await Orders.find({
        createdAt: { $gte: sixMonthsAgo, $lte: now },
        status: "received",
      });

      // Nếu không có đơn hàng nào
      if (!orders.length) {
        return res.status(StatusCodes.OK).json({
          message: "Không có đơn hàng nào trong vòng 6 tháng gần nhất",
          data: Object.keys(monthlyStats).map((month) => ({
            month,
            total: 0,
          })),
        });
      }

      // Thống kê tổng sản phẩm trong mỗi tháng
      for (const order of orders) {
        const monthIndex = order.createdAt.getMonth();
        const month = vietnameseMonths[monthIndex];

        let totalProductsInOrder = 0;
        for (const item of order.items) {
          totalProductsInOrder += item.quantity; // Giả định mỗi `item` có trường `quantity`
        }

        monthlyStats[month] += totalProductsInOrder;
      }

      // Chuyển dữ liệu thống kê thành mảng
      const chartData = Object.keys(monthlyStats).map((month) => ({
        month,
        total: monthlyStats[month],
      }));

      return res.status(StatusCodes.OK).json({
        message: "Thống kê thành công",
        data: chartData,
      });
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Lỗi: " + error.message,
      });
    }
  },
  getTop5BestSellingProducts: async (req, res) => {
    try {
      // 1. Truy vấn tất cả các đơn hàng có status là "received"
      const orders = await Orders.find({ status: "received" });

      if (!orders.length) {
        return res.status(StatusCodes.OK).json({
          message: 'Không có đơn hàng nào với trạng thái "received"',
          data: [],
        });
      }

      // 2. Tính tổng số lượng bán ra của từng sản phẩm và tùy chọn sản phẩm
      const productSales = {};
      for (const order of orders) {
        for (const item of order.items) {
          const { productId, productOptionId, quantity } = item;

          const key = `${productId}_${productOptionId}`;
          if (!productSales[key]) {
            productSales[key] = { productId, productOptionId, quantity: 0 };
          }
          productSales[key].quantity += quantity;
        }
      }

      // 3. Sắp xếp để tìm top 5 sản phẩm bán chạy nhất
      const top5ProductsWithOptions = Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      const result = [];
      for (const item of top5ProductsWithOptions) {
        const { productId, productOptionId, quantity } = item;

        // Tìm thông tin sản phẩm
        const product = await Products.findById(productId);
        if (!product) continue;

        // Lấy thông tin biến thể từ ProductItemModel
        const productItem = await ProductItemModel.findOne({ _id: productOptionId.toString(), productId: productId  });
        // Lấy thông tin categoryName từ CategoryModel
        const category = await CategoryModel.findById(product.category);
        const categoryName = category ? category.categoryName : "Unknown";
        const image = productItem.image;

        // Kết hợp thông tin
        result.push({
          ...product.toObject(),
          productOptionId,
          quantity,
          variants: productItem.variants,
          categoryName,
          image: image
        });
      }

      return res.status(StatusCodes.OK).json({
        message: "Top 5 sản phẩm bán chạy nhất",
        data: result,
      });
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Lỗi: " + error.message,
      });
    }
  },
};
