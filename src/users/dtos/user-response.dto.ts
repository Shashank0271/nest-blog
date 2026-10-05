import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiPropertyOptional()
  lastName: string | null;

  @ApiProperty()
  email: string;
}
