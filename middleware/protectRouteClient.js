import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRouteClient = async (req, res, next) => {
  try {
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

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Người dùng không tìm thấy" });
    }
    if (user.active === false) {
      return res
        .status(401)
        .json({ error: "Tài khoản người người dùng đã bị khóa" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default protectRouteClient;
