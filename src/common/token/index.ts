/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/auth/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true; // skip guard for public routes

    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.accessToken;
    if (!token) throw new UnauthorizedException('Access token missing');

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'ACCESS_SECRET',
      });
      request.user = payload; // attach user info
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
