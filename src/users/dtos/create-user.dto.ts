import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  firstName: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(96)
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(96)
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(96)
  password: string;
}

export class CreateUsersDto {
  @ApiProperty({
    type: () => CreateUserDto,
    isArray: true,
    required: true,
    description: 'array of users that we need to create',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  users: CreateUserDto[];
}
