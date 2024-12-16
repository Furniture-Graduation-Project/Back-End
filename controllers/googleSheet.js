import { StatusCodes } from "http-status-codes";
import { schemaGoogleSheet } from "../validations/sheet.js";
import { appendDataToSheet } from "../services/googleSheets.js";
const GoogleSheeetController = {
  write: async (req, res) => {
    const { mail } = req.body;

    const { error } = schemaGoogleSheet.validate({ mail });
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.details[0].message, 
      });
    }
    const data = [[mail, new Date().toISOString().split("T")[0]]]; 

    try {
      await appendDataToSheet(data);
      return res.status(StatusCodes.OK).json({
        message: "Dữ liệu đã được ghi vào Google Sheets thành công",
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Đã xảy ra lỗi khi ghi dữ liệu vào Google Sheets",
        error: error.message,
      });
    }
  },
};

export default GoogleSheeetController;
