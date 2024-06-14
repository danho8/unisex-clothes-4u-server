import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuardCMS implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly logger: Logger,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const isPublic = this.reflector.get<string[]>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) return true;
    return this.authMiddlewareCMS(req);
  }
  private async authMiddlewareCMS(req: Request) {
    try {
      const token = this.extractTokenFromHeader(req);
      if (!token) {
        throw new UnauthorizedException();
      }
      if (token) {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.CMS_JWT_SECRET,
        });
        req['user'] = payload;
        return true;
      } else {
        this.logger.error('Missing token!!!');
        throw new UnauthorizedException();
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new UnauthorizedException();
    }
  }
  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers['authorization'].split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
