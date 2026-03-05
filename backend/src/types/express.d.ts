import { Role } from "../../generated/prisma";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      username: string;
      role: Role;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
