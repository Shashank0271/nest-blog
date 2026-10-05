import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/signin.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import type { ActiveUser } from './interfaces/authenticated-request.interface';
import { AccessTokenDto, JwtTokenResponseDto } from './dtos/token.dto';

@Controller('/api/v1/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  @ApiOperation({
    description: 'signs in given user returning access and refresh token pairs',
  })
  @ApiCreatedResponse({
    description:
      'returns a pair of access and refresh tokens for the current user',
    type: JwtTokenResponseDto,
  })
  public signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('refresh')
  @ApiOperation({
    description: 'returns a fresh access token',
  })
  @ApiCreatedResponse({
    description: 'fresh access token returned',
    type: AccessTokenDto,
  })
  public refreshAccessToken(@CurrentUser() currentUser: ActiveUser) {
    return this.authService.refreshAccessToken(currentUser);
  }
}
