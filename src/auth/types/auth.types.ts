import { User as PrismaUser } from '@prisma/client';

// 1. Criamos nosso tipo customizado, removendo a senha, como antes.
export type AuthenticatedUser = Omit<PrismaUser, 'passwordHash'>;

declare global {
  namespace Express {
    export interface User extends AuthenticatedUser {}

    export interface Request {
      user?: User;
    }
  }
}