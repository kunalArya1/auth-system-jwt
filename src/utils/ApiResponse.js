class ApiResponse {
  constructor(statuscode, data, message) {
    this.statuscode = statuscode;
    this.data = data;
    this.message = message;
  }
}

export { ApiResponse };
