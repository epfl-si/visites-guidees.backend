import { Logger } from '@nestjs/common';
import { getRequestId } from '@/common/context/request.context';

export class AppLogger extends Logger {
  log(message: string) {
    super.log(this.enhance(message));
  }

  warn(message: string) {
    super.warn(this.enhance(message));
  }

  error(message: string, trace?: string) {
    super.error(this.enhance(message), trace);
  }

  private enhance(message: string): string {
    const requestId = getRequestId();
    return requestId ? `[${requestId}] ${message}` : message;
  }
}