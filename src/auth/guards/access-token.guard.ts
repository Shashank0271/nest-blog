import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import authConfig from 'src/auth/config/auth.config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC } from 'src/auth/decorators/public.decorator';
import type {
  ActiveUser,
  AuthenticatedRequest,
} from 'src/auth/interfaces/authenticated-request.interface';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,

    @Inject(authConfig.KEY)
    private readonly authenticationConfig: ConfigType<typeof authConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>(); // create your own so that we can have a custom request object
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const jwtToken = request.headers.authorization?.split(' ')[1];
    if (!jwtToken) {
      throw new UnauthorizedException(`Unauthorized - no token found`);
    }

    const payload = await this.jwtService.verifyAsync<ActiveUser>(
      jwtToken,
      this.authenticationConfig,
    ); // returns the decoded body of the jwt

    request.user = payload;
    return true;
  }
}
