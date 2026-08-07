import { InternalServerErrorException } from "@nestjs/common";
import { last } from "rxjs";

interface ApiCallOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: HeadersInit;
  body?: unknown;
}

const EPFL_API_URL = process.env.API_EPFL_URL || 'https://api.epfl.ch/';

const username = process.env.SERVICE_ACCOUNT_USERNAME

const password = process.env.SERVICE_ACCOUNT_PASSWORD

let EPFLapiHeaders = new Headers();

EPFLapiHeaders.set('authorization', 'Basic ' + Buffer.from(username + ":" + password).toString('base64'));

EPFLapiHeaders.set('accept', 'application/json');

export async function apiCall<T>(
  url: string,
  options: ApiCallOptions = {}
): Promise<T> {
  const method = options.method || 'GET';
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (options.body && ['POST', 'PUT'].includes(method.toUpperCase())) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, fetchOptions);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`Failed to fetch API: ${url} (${response.status})`);
  }
}

export async function callEPFLApi<T>(
  endpoint: string,
  options: ApiCallOptions = {}
): Promise<T> {

  if (!EPFL_API_URL || !password || !username) {
    throw new InternalServerErrorException()
  }

  const url = `${EPFL_API_URL}${endpoint}`

  let usedOption = options;

  const mergedHeaders = new Headers(options.headers);

  EPFLapiHeaders.forEach((value, key) => {
    mergedHeaders.set(key, value);
  });

  usedOption.headers = mergedHeaders;

  return apiCall<T>(url, usedOption)

}