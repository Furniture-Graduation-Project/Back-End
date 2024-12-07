import dotenv from 'dotenv';
import { sendEmail } from '../utils/email.js';
dotenv.config();
export const sendShipmentNotificationEmail = async (updatedOrder) => {
  const subject = `Thông báo: Đơn hàng #${updatedOrder.code} đang được giao hàng`;

  const text = `
Kính gửi quý khách ${updatedOrder.orderName},

Chúng tôi rất vui thông báo rằng đơn hàng của quý khách đã được vận chuyển và đang trên đường đến địa chỉ:

**Địa chỉ giao hàng**: ${updatedOrder.orderAddress}  
**Người nhận hàng**: ${updatedOrder.orderName}  
**Số điện thoại**: ${updatedOrder.orderPhone}  

Quý khách có thể theo dõi đơn hàng qua liên kết: ${process.env.CLIENT_URL}/account/order/${updatedOrder._id}

Chúng tôi sẽ tiếp tục cập nhật trạng thái đơn hàng của quý khách. Nếu có bất kỳ thắc mắc nào, xin vui lòng liên hệ với chúng tôi qua email này hoặc số hotline: ${process.env.ACCOUNT_NO}.

Trân trọng,  
Nội thất River  
${process.env.ACCOUNT_NO} 
Website: ${process.env.CLIENT_URL}
`;

  return sendEmail(updatedOrder.userId.email, subject, text);
};

export const sendDeliveredNotificationEmail = async (updatedOrder) => {
  const productList = updatedOrder.items
    .map((item, index) => {
      const variants =
        item.productOptionId?.variants &&
        item.productOptionId.variants
          .map((variant) => `${variant.variant}: ${variant.value}`)
          .join(', ');

      return `${index + 1}. ${item.productId.name} - ${item.quantity} ${
        variants ? `(Tùy chọn: ${variants})` : ''
      } x ${item.unitPrice.toLocaleString()} VNĐ = ${(
        item.quantity * item.unitPrice
      ).toLocaleString()} VNĐ`;
    })
    .join('\n');
  const subject = `Thông báo: Đơn hàng #${updatedOrder.code} đã giao thành công`;

  const text = `
Kính gửi quý khách ${updatedOrder.orderName},

Chúng tôi xin thông báo rằng đơn hàng của quý khách đã được giao thành công đến địa chỉ:

**Địa chỉ giao hàng**: ${updatedOrder.orderAddress}  
**Người nhận hàng**: ${updatedOrder.orderName}  
**Số điện thoại**: ${updatedOrder.orderPhone}  

### Danh sách sản phẩm:
${productList}

**Tổng giá trị đơn hàng**: ${updatedOrder.totalPrice.toLocaleString()} VNĐ  

Chúng tôi hy vọng quý khách hài lòng với sản phẩm và dịch vụ của chúng tôi. Nếu có bất kỳ vấn đề gì liên quan đến đơn hàng, xin vui lòng liên hệ với chúng tôi qua email này hoặc số hotline: ${
    process.env.ACCOUNT_NO
  }.

Trân trọng,  
Nội thất River  
${process.env.ACCOUNT_NO} 
Website: ${process.env.CLIENT_URL}
`;

  return sendEmail(updatedOrder.userId.email, subject, text);
};
