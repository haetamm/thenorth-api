export const successResponse = (statusCode: number, data?: any) => ({
  statusCode,
  status: "success",
  data,
});

export const failResponse = (statusCode: number, message: string) => ({
  statusCode,
  status: "fail",
  message,
});
