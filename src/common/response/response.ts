export type ErrorType = string | Record<string, any> | any[];

export class ResponseDto<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ErrorType;
  statusCode: number;

  constructor(init: {
    success: boolean;
    message: string;
    data?: T;
    errors?: ErrorType;
    statusCode: number;
  }) {
    this.success = init.success;
    this.message = init.message;
    this.data = init.data;
    this.errors = init.errors;
    this.statusCode = init.statusCode;
  }
}

export class ResponseService {
  success<T>(data: T, message = 'Request successful', statusCode) {
    return new ResponseDto<T>({ success: true, message, data, statusCode });
  }

  error(errors: ErrorType, message = 'Request failed', statusCode) {
    return new ResponseDto({ success: false, message, errors, statusCode });
  }
}
