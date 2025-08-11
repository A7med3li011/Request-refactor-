export class AppError extends Error {
  constructor(message, statusCode, success) {
    super(message);
    // this.success = success;
    this.statusCode = statusCode;
  }
}
