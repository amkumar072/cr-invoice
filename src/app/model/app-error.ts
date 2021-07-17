export class AppError {
  customError: any;
  dateTime: Date = new Date();
  errorCode: string;
  errorMessage: string;

  constructor(customError?: any, errorCode?: string, errorMessage?: string) {
    this.customError = customError;
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
  }
}
