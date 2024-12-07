const generateOrderCode = (startTime = Date.now()) => {
  const time = Math.floor(startTime / 1000) 
    .toString(16)
    .toUpperCase();

  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `ORD-${time}-${randomPart}`;
};

export default generateOrderCode;
