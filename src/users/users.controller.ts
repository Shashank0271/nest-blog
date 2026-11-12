import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDto, CreateUsersDto } from './dtos/create-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import {
  PaginatedResponseType,
  StandardResponseType,
} from 'src/common/swagger/response-types';
import { User } from './entities/user.entity';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiBearerAuth()
@Controller('/api/v1/users')
@ApiTags('Users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  @Public()
  @ApiOperation({
    summary: 'creates the user with required parameters',
  })
  @ApiCreatedResponse({
    description: 'Created user',
    type: StandardResponseType(UserResponseDto),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('/bulk')
  @ApiOperation({
    summary: 'creates the users with required parameters',
  })
  @ApiOkResponse({
    summary: 'created users',
    type: StandardResponseType(UserResponseDto, { isArray: true }),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  public createUsers(@Body() createUsersDto: CreateUsersDto) {
    return this.userService.createUsers(createUsersDto.users);
  }

  @Get('/:uid')
  @ApiOperation({
    summary: 'fetches the required user details by consuming userid',
  })
  @ApiOkResponse({
    description: 'fetched user schema of required userid',
    type: StandardResponseType(User),
  })
  public getUser(@Param('uid') uid: number) {
    return this.userService.getUser(uid);
  }

  @Get()
  @ApiOperation({
    summary: 'fetches a list of registered users for this app',
  })
  @ApiOkResponse({
    description: 'Users fetched successfully based on the query',
    type: PaginatedResponseType(UserResponseDto),
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'number of entries returned per query',
    default: 10,
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'page number of the record set being returned',
    default: 1,
    example: 1,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  public getUsers(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.userService.getUsers(paginationQueryDto);
  }

  @Patch('/:uid')
  public updateUser(@Param('uid') uid: string) {
    return `updating user with id : ${uid}`;
  }
}
