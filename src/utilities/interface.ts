import { Request } from "express";

export interface User {
  id: number;
  username: string;
  createdAt: Date;
  deletedAt: Date | null;
  roles: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}
