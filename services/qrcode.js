import dotenv from 'dotenv';
dotenv.config();

const apiQr = process.env.QR_URL;
const generateQrCode = async (data) => {
  try {
    const response = await fetch(apiQr, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': process.env.QR_API_KEY,
        'x-api-key': process.env.QR_SECRET_KEY,
      },
      body: JSON.stringify({
        accountNo: process.env.ACCOUNT_NO,
        accountName: process.env.ACCOUNT_NAME,
        acqId: Number(process.env.ACQUIRER_ID),
        amount: data.amount,
        addInfo: data.addInfo,
        format: 'text',
        template: 'compact',
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const dataQr = await response.json();
    return dataQr;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export default generateQrCode;
