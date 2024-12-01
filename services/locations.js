import fs from 'fs';
import path from 'path';
export const getAllLocation = (req, res) => {
  try {
    const filePath = path.join( 'locations.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const locationData = JSON.parse(rawData);
    res.json({
      message: 'Lấy tất cả các địa điểm thành công',
      data: locationData,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Đã xảy ra lỗi khi lấy dữ liệu địa điểm',
      error: error.message,
    });
  }
};
