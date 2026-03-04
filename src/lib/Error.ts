import utils from "../utils";

class CustomError {
  message: string;
  status: number;

  constructor(message: string, status: number) {
    this.message = message;
    this.status = status;
  }

  static notFound(message = '404 Not Found', status = 404) {
    return new CustomError(utils.formatError(message), status);
  }
  static unauthorized(message = 'Unauthorized', status = 401) {
    return new CustomError(utils.formatError(message), status);
  }
  static forbidden(message = 'Forbidden', status = 403) {
    return new CustomError(utils.formatError(message), status);
  }
  static badRequest(message = 'Bad Request', status = 400) {
    return new CustomError(utils.formatError(message), status);
  }
  static internalServerError(message = 'Internal Server Error', status = 500) {
    return new CustomError(utils.formatError(message), status);
  }
  static validationError(message = 'Validation Error', status = 422) {
    return new CustomError(utils.formatError(message), status);
  }
  static conflictError(message = 'Conflict Error', status = 409) {
    return new CustomError(utils.formatError(message), status);
  }
}

export default CustomError  
