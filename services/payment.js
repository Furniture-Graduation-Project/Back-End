import dotenv from "dotenv";
dotenv.config();

const callApi = async () => {
  try {
    const response = await fetch(process.env.EXCEL_URL);
    if (!response.ok) {
      throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
    }
    const data = await response.json();
    if (data && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.error(
        "Định dạng dữ liệu không hợp lệ: mong đợi một đối tượng chứa mảng dữ liệu, nhưng nhận được:",
        data
      );
      return null;
    }
  } catch (error) {
    console.error("Đã xảy ra lỗi trong callApi:", error);
    return null;
  }
};

const checkDescription = (payments, infoPayment) => {
  return payments.find((payment) => {
    const datePayment = new Date(payment.transactionDate).getTime();
    const startTime = new Date(infoPayment.startTime).getTime();
    const endTime = startTime + 360000;
    const isAmountMatching =
      Number(infoPayment.amount) === Number(payment.value);
    const isDescriptionMatching = payment.description.includes(
      infoPayment.description
    );
    const isStartTimeValid = datePayment >= startTime;
    const isEndTimeValid = datePayment <= endTime;
    return (
      isAmountMatching &&
      isDescriptionMatching &&
      isStartTimeValid &&
      isEndTimeValid
    );
  });
};

const paymentApiCall = async (infoPayment) => {
  const startTime = Date.now();
  let check = true;
  let result = null;

  while (Date.now() - startTime < 120000 && check) {
    const data = await callApi();
    if (data && Array.isArray(data)) {
      const checkData = checkDescription(data, infoPayment);
      console.log(checkData);

      if (checkData) {
        console.log("Đã tìm thấy giao dịch:", checkData);
        check = false;
        result = checkData;
        break;
      }
    } else {
      console.error("Định dạng dữ liệu không hợp lệ:", typeof data);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return result;
};

export default paymentApiCall;
