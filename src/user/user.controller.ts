import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { LoginUserDto } from '@app/user/dto/loginUser.dto';
import { IUserRespose } from '@app/user/types/userRespose.interface';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UpdateUserDto } from '@app/user/dto/updateUser.dto';
import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipe';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  // @UsePipes(new ValidationPipe())
  /* this is the default nestjs validation provider and returns error message in it's own way,
   we do not have control over error message formatting  here */
  @UsePipes(new BackendValidationPipe())
  /* With this we have implemented our owne Validation pipe with custom error message */
  async createUser(
    @Body('user') createUserData: CreateUserDto,
  ): Promise<IUserRespose> {
    const user = await this.userService.createUSer(createUserData);
    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  // @UsePipes(new ValidationPipe())
  /* this is the default nestjs validation provider and returns error message in it's own way,
   we do not have control over error message formatting  here */
  @UsePipes(new BackendValidationPipe())
  /* With this we have implemented our owne Validation pipe with custom error message */
  async login(
    @Body('user') loginUserData: LoginUserDto,
  ): Promise<IUserRespose> {
    const user = await this.userService.login(loginUserData);
    return this.userService.buildUserResponse(user);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity): Promise<IUserRespose> {
    return this.userService.buildUserResponse(user);
  }

  @Put('user')
  // @UsePipes(new ValidationPipe())
  /* this is the default nestjs validation provider and returns error message in it's own way,
   we do not have control over error message formatting  here */
  @UsePipes(new BackendValidationPipe())
  /* With this we have implemented our owne Validation pipe with custom error message */
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @User('id') userId: number,
    @Body('user') userUpdateData: UpdateUserDto,
  ): Promise<IUserRespose> {
    const user = await this.userService.updateUser(userId, userUpdateData);
    return this.userService.buildUserResponse(user);
  }
}
