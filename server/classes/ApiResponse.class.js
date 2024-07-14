export default class ApiResponse {
  constructor(status, data, message = "ok") {
    this.status = status;
    this.message = message;
    this.errors = null;

    this.data = data;
    this.success = status < 400;
  }
}
