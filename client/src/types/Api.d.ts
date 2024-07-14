/**
 * Define ApiResponse interface with properties
 * same as the response data sent by API
 * to maintain consistency and type safety
 */
export interface ApiResponse {
  /**
   * Status Code of response
   */
  status: number;

  /**
   * Error / Success Message
   * related to request
   */
  message: string;

  /**
   * Error details, if any
   */
  errors: any;

  /**
   * Data received from API Request
   */
  data: any;

  /**
   * Response Success Status
   */
  success: boolean;
}
