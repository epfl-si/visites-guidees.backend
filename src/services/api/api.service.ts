import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface ApiCallOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: HeadersInit;
  body?: unknown;
}

@Injectable()
export class ApiService {
  private readonly epflApiUrl: string;
  private readonly epflAuthHeader: string | null;

  constructor(private readonly configService: ConfigService) {
    this.epflApiUrl = this.configService.get<string>(
      'API_EPFL_URL',
      'https://api.epfl.ch/',
    );

    const username = this.configService.get<string>('SERVICE_ACCOUNT_USERNAME');
    const password = this.configService.get<string>('SERVICE_ACCOUNT_PASSWORD');

    this.epflAuthHeader =
      username && password
        ? 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
        : null;
  }

  async call<T>(url: string, options: ApiCallOptions = {}): Promise<T> {
    const method = options.method ?? 'GET';
    const headers = new Headers(options.headers);

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }

    const fetchOptions: RequestInit = { method, headers };

    if (options.body && ['POST', 'PUT'].includes(method.toUpperCase())) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`Failed to fetch API: ${url} (${response.status})`);
    }

    return (await response.json()) as T;
  }

  async callEPFLApi<T>(
    endpoint: string,
    options: ApiCallOptions = {},
  ): Promise<T> {
    if (!this.epflApiUrl || !this.epflAuthHeader) {
      throw new InternalServerErrorException('EPFL API is not configured');
    }

    const headers = new Headers();
    headers.set('authorization', this.epflAuthHeader);
    headers.set('accept', 'application/json');

    if (options.headers) {
      new Headers(options.headers).forEach((value, key) => {
        headers.set(key, value);
      });
    }

    return this.call<T>(`${this.epflApiUrl}${endpoint}`, {
      ...options,
      headers,
    });
  }
}
