import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {
  @ApiProperty({
    description: 'access token',
  })
  accessToken: string;
}

export class JwtTokenResponseDto {
  @ApiProperty({
    description: 'access token',
  })
  accessToken: string;
  @ApiProperty({
    description: 'refresh token',
  })
  refreshToken: string;
}
