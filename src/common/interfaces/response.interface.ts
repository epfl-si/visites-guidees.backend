export interface ApiError {
  success: false;
  message: string[];
  error: string;
  code: number;
  timestamp: string;
  requestId: string;
}