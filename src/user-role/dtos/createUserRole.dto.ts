import { IsNotEmpty, IsInt } from 'class-validator';

export class RegisterUserRoleDTO {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  roleId: number;
}
