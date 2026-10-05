import type { Request } from 'express';

export interface ActiveUser {
  email: string;
  id: number;
}

export interface AuthenticatedRequest extends Request {
  user: ActiveUser;
}

export enum TokenType {
  ACCESS,
  REFRESH,
}
