export default class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWaith("4") ? "fail" : "error";
  }
}
