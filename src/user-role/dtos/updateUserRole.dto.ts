import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserRoleDTO } from './createUserRole.dto';

export class UpdateUserRoleDTO extends PartialType(RegisterUserRoleDTO) {}
