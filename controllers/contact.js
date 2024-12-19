import { StatusCodes } from "http-status-codes";
import { sendEmail } from "../utils/email.js";

const ContactController = {
  contact: async (req, res) => {
    try {
      const { email, subject, text } = req.body;
      if (!email || !subject || !text) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Không tìm thấy dữ liệu đầu vào",
        });
      }
      const contact = sendEmail(email, subject, "", text);
      if (!contact) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Gủi yêu cầu liên hệ thất bại",
        });
      }
      res.status(StatusCodes.OK).json({
        message: "Gủi yêu cầu liên hệ thành công",
        data: contact,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },
};
export default ContactController;
