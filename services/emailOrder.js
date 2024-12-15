import dotenv from 'dotenv';
import { sendEmail } from '../utils/email.js';
dotenv.config();

export const sendShipmentNotificationEmail = async (updatedOrder) => {
  const subject = `Thông báo: Đơn hàng #${updatedOrder.code} đang được giao hàng`;
  const html = `
   
          <h2 style="color: #333;">Kính gửi quý khách ${updatedOrder.orderName},</h2>
          <p style="font-size: 16px;">Chúng tôi rất vui thông báo rằng đơn hàng của quý khách đã được vận chuyển và đang trên đường đến địa chỉ:</p>
          <p style="font-size: 16px;"><strong style="color: #3a8eeb;">Địa chỉ giao hàng:</strong> ${updatedOrder.orderAddress}</p>
          <p style="font-size: 16px;"><strong style="color: #3a8eeb;">Người nhận hàng:</strong> ${updatedOrder.orderName}</p>
          <p style="font-size: 16px;"><strong style="color: #3a8eeb;">Số điện thoại:</strong> ${updatedOrder.orderPhone}</p>
          <p style="font-size: 16px;">Quý khách có thể theo dõi đơn hàng qua liên kết: <a href="${process.env.CLIENT_URL}/account/order/${updatedOrder._id}" style="color: #3498db; text-decoration: none;">Theo dõi đơn hàng</a></p>
          <p style="font-size: 16px;">Chúng tôi sẽ tiếp tục cập nhật trạng thái đơn hàng của quý khách. Nếu có bất kỳ thắc mắc nào, xin vui lòng liên hệ với chúng tôi qua email này hoặc số hotline: ${process.env.ACCOUNT_NO}.</p>
       
  `;

  return sendEmail(updatedOrder.userId.email, subject, '', html);
};

export const sendDeliveredNotificationEmail = async (updatedOrder) => {
  const productList = updatedOrder.items
    .map((item, index) => {
      const variants =
        item.productOptionId?.variants &&
        item.productOptionId.variants
          .map((variant) => `${variant.variant}: ${variant.value}`)
          .join(', ');

      return `<li style="font-size: 16px; line-height: 1.6; margin-bottom: 10px; display: flex; align-items: center;">
      <img src="${item.productOptionId.image}" alt="${item.productId.name}" 
           style="width: 100px; height: 100px; object-fit: cover; margin-right: 10px; border-radius: 4px;" />
      <span style="flex-grow: 1;">
        ${index + 1}. ${item.productId.name} - ${item.quantity} 
        ${variants ? `(Tùy chọn: ${variants})` : ''}
        x ${item.unitPrice.toLocaleString()} VNĐ = 
        ${(item.quantity * item.unitPrice).toLocaleString()} VNĐ
      </span>
    </li>`;
    })
    .join('');

  const subject = `Thông báo: Đơn hàng #${updatedOrder.code} đã giao thành công`;

  const html = `

          <h2 style="color: #333;">Kính gửi quý khách ${
            updatedOrder.orderName
          },</h2>
          <p style="font-size: 16px;">Chúng tôi xin thông báo rằng đơn hàng của quý khách đã được giao thành công đến địa chỉ:</p>
          <p style="font-size: 16px;"><strong style="color: #3a8eeb;">Địa chỉ giao hàng:</strong> ${
            updatedOrder.orderAddress
          }</p>
          <p style="font-size: 16px;"><strong style="color: #3a8eeb;">Người nhận hàng:</strong> ${
            updatedOrder.orderName
          }</p>
          <p style="font-size: 16px;"><strong style="color: #3a8eeb;">Số điện thoại:</strong> ${
            updatedOrder.orderPhone
          }</p>
          <h3 style="font-size: 18px; color: #333;">Danh sách sản phẩm:</h3>
          <ul style="font-size: 16px; line-height: 1.8;">${productList}</ul>
          <p style="font-size: 16px;"><strong style="color: #3a8eeb;">Tổng giá trị đơn hàng:</strong> ${updatedOrder.totalPrice.toLocaleString()} VNĐ</p>
          <p style="font-size: 16px;">Chúng tôi hy vọng quý khách hài lòng với sản phẩm và dịch vụ của chúng tôi. Nếu có bất kỳ vấn đề gì liên quan đến đơn hàng, xin vui lòng liên hệ với chúng tôi qua email này hoặc số hotline: ${
            process.env.ACCOUNT_NO
          }.</p>
  
  `;

  return sendEmail(updatedOrder.userId.email, subject, '', html);
};
