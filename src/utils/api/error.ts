import axios, { AxiosError } from 'axios';

export class APIError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode
    };
  }
}

export function handleAPIError(error: unknown, context: string): never {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status;
    const message = `${context}: ${error.response?.data?.error || error.message}`;
    throw new APIError(message, statusCode);
  }
  
  if (error instanceof Error) {
    throw new APIError(`${context}: ${error.message}`);
  }
  
  throw new APIError(`${context}: Unknown error occurred`);
}