import jwt from "jsonwebtoken";
import Employee from "../models/employee.js";

const protectRoute = async (req, res, next) => {
  try {
    // const authorizationHeader = req.headers["authorization"];
    // const token = authorizationHeader && authorizationHeader.split(" ")[1];
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ error: "Chưa xác thực - Không có Token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ error: "Token đã hết hạn - Vui lòng đăng nhập lại" });
      }
      throw error;
    }

    const user = await Employee.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Người dùng không tìm thấy" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Lỗi trong middleware protectRoute:", error.message);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};

export default protectRoute;
