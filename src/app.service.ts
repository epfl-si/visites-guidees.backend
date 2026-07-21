import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getUserInfo(): string {
    // This is a placeholder for user info retrieval logic.
    // In a real application, you would retrieve user info from the request or session.
    return 'User info would be here.';
  }
}
