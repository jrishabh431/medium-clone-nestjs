import { UserType } from '@app/user/types/user.type';

export interface IUserRespose {
  user: UserType & { token: string };
}
