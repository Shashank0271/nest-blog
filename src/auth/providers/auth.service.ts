import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { HashingProvider } from './hashing.provider';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import authConfig from '../config/auth.config';
import {
  ActiveUser,
  TokenType,
} from '../interfaces/authenticated-request.interface';
import { AccessTokenDto } from '../dtos/token.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,

    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
  ) {}

  public async signIn(signInDto: SignInDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const { email, password } = signInDto;
    const requiredUser = await this.userService.getUserByEmail(email);
    const isPasswordValid = await this.hashingProvider.comparePassword(
      password,
      requiredUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(`Invalid credentials`);
    }

    const payload = {
      email: email,
      sub: requiredUser.id,
    };

    const accessToken = await this.getJwtToken(payload, TokenType.ACCESS);
    const refreshToken = await this.getJwtToken(payload, TokenType.REFRESH);

    return {
      accessToken,
      refreshToken,
    };
  }

  public async refreshAccessToken(
    activeUser: ActiveUser,
  ): Promise<AccessTokenDto> {
    return {
      accessToken: await this.getJwtToken(
        { email: activeUser.email, sub: activeUser.id },
        TokenType.REFRESH,
      ),
    };
  }

  private async getJwtToken(
    payload: { email: string; sub: number },
    tokenType: TokenType,
  ): Promise<string> {
    if (tokenType === TokenType.ACCESS) {
      return await this.jwtService.signAsync(payload, {
        secret: this.authConfiguration.secret,
        expiresIn: this.authConfiguration
          .accessTokenTtl as JwtSignOptions['expiresIn'],
      });
    } else {
      return await this.jwtService.signAsync(payload, {
        secret: this.authConfiguration.secret,
        expiresIn: this.authConfiguration
          .refreshTokenTtl as JwtSignOptions['expiresIn'],
      });
    }
  }
}
