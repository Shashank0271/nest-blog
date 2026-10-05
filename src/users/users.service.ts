import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly paginationProvider: PaginationProvider,
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException(`User with email ${email} already exists`);
    }
    let newUser = this.userRepository.create(createUserDto);
    newUser.password = await this.hashingProvider.hashPassword(password);
    return (newUser = await this.userRepository.save(newUser));
  }

  public async createUsers(createUserDtos: CreateUserDto[]) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const newUsers: User[] = [];
      for (const user of createUserDtos) {
        user.password = await this.hashingProvider.hashPassword(user.password);
        const newUser = queryRunner.manager.create(User, user);
        const savedUser = await queryRunner.manager.save(newUser);
        newUsers.push(savedUser);
      }
      await queryRunner.commitTransaction();
      return newUsers;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Encountered exception while saving users `,
        error instanceof Error ? error.toString() : String(error),
      );
    } finally {
      await queryRunner.release();
    }
  }

  public async getUser(userId: number): Promise<User> {
    const requiredUser = await this.userRepository.findOne({
      where: { id: userId },
      // relations: { posts: true },
    });
    if (!requiredUser) {
      throw new NotFoundException(`User with id : ${userId} not found`);
    }
    return requiredUser;
  }

  public async getUserByEmail(email: string): Promise<User> {
    const requiredUser = await this.userRepository.findOneBy({ email });
    if (!requiredUser) {
      throw new NotFoundException(`User with email : ${email} not found`);
    }
    return requiredUser;
  }

  public async getUsers(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<User>> {
    const { limit, page } = paginationQueryDto;
    return await this.paginationProvider.paginateQuery(
      { page, limit },
      this.userRepository,
    );
  }
}
