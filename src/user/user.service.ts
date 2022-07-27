import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { LoginUserDto } from '@app/user/dto/loginUser.dto';
import { UserEntity } from '@app/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { IUserRespose } from '@app/user/types/userRespose.interface';
import { compare } from 'bcrypt';
import { UpdateUserDto } from '@app/user/dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUSer(createUserData: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      email: createUserData.email,
    });
    const userByUsername = await this.userRepository.findOne({
      username: createUserData.username,
    });
    if (userByEmail || userByUsername) {
      throw new HttpException(
        'Email or Username already occupied',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserData);
    return await this.userRepository.save(newUser);
  }

  async updateUser(
    id: number,
    updateUserData: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findById(id);

    if (updateUserData?.email && updateUserData.email !== user.email) {
      const userByEmail = await this.userRepository.findOne({
        email: updateUserData.email,
      });
      if (userByEmail) {
        throw new HttpException(
          'Email already occupied',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (updateUserData?.username && updateUserData.username !== user.username) {
      const userByUsername = await this.userRepository.findOne({
        email: updateUserData.username,
      });
      if (userByUsername) {
        throw new HttpException(
          'Username already occupied',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
    Object.assign(user, updateUserData);
    return await this.userRepository.save(user);
  }

  async login(loginUserData: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne(
      {
        email: loginUserData.email,
      },
      { select: ['id', 'email', 'username', 'password', 'bio', 'image'] },
    );
    if (!user) {
      throw new HttpException('Incorrect Username', HttpStatus.UNAUTHORIZED);
    }
    const isPasswordCorrect = await compare(
      loginUserData.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new HttpException('Incorrect Password', HttpStatus.UNAUTHORIZED);
    }

    delete user.password;
    return user;
  }

  async findById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne(id);
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      JWT_SECRET,
    );
  }

  buildUserResponse(user: UserEntity): IUserRespose {
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
