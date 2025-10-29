import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDTO } from './createUser.dto';

export class UpdateUserDTO extends PartialType(RegisterUserDTO) {}
