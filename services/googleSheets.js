import sheets from "../utils/googleSheet.js";

const spreadsheetId = "1VTjpbIgYgwKo7IcVYbqT7Q8-IOFyxApjmjUYvJpNqQU";

export async function appendDataToSheet(data) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A:A", 
    });

    const existingData = response.data.values;
    let lastSTT = 0;

    if (existingData && existingData.length > 0) {
      lastSTT = parseInt(existingData[existingData.length - 1][0]) || 0;
    }

    const updatedData = data.map((row) => {
      const newSTT = lastSTT + 1;
      lastSTT = newSTT;
      return [newSTT, ...row];
    });


    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:C", 
      valueInputOption: "RAW",
      resource: {
        values: updatedData,
      },
    });

    return "Dữ liệu đã được ghi vào Google Sheets!";
  } catch (err) {
    console.error("Lỗi khi ghi vào Google Sheets:", err);
    throw new Error("Có lỗi xảy ra khi ghi vào Google Sheets");
  }
}
