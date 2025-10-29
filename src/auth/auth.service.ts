import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import * as bcrypt from 'bcrypt';
  import { PrismaService } from 'src/prisma/prisma.service';
  import { LoginUserDTO } from './dtos/loginUser.dto';
  import { RegisterUserDTO } from 'src/user/dtos/createUser.dto';
  import { UserService } from 'src/user/user.service';
  import { RoleService } from 'src/role/role.service';
  import { UserRoleService } from 'src/user-role/user-role.service';
  
  @Injectable()
  export class AuthService {
    constructor(
      private prisma: PrismaService,
      private jwtService: JwtService,
      private userService: UserService,
      private roleService: RoleService,
      private userRoleService: UserRoleService,
    ) {}
  
    async validateUser(email: string, pass: string): Promise<any> {
      const user = await this.userService.findUserByEmail(email, true);
  
      if (!user) return null;
  
      await bcrypt.compare(pass, user.passwordHash);
  
      const { passwordHash, createdAt, updatedAt, deletedAt, ...data } = user;
  
      return data;
    }
  
    async login(loginUser: LoginUserDTO) {
      const validateEmail = await this.prisma.user.findFirst({
        where: { email: loginUser.email, deletedAt: null },
      });
  
      if (!validateEmail)
        throw new NotFoundException('Email não encontrado', {
          cause: new Error(),
          description:
            'Nenhum usuario cadastrado com esse email. Por favor insira outro email.',
        });
  
      const validPassword = await bcrypt.compare(
        loginUser.passwordHash,
        validateEmail.passwordHash,
      );
  
      if (!validPassword)
        throw new BadRequestException('Senha incorreta!', {
          cause: new Error(),
          description: 'A senha que o usario inseriu está incorreta!',
        });
  
      const payload = { sub: validateEmail.id, email: validateEmail.email };
  
      const token = await this.jwtService.signAsync(payload);
  
      const {
        passwordHash: __,
        createdAt,
        updatedAt,
        deletedAt,
        ...loginData
      } = validateEmail;
  
      const data = { ...loginData, token };
  
      return data;
    }
  
    async register(registerUserDTO: RegisterUserDTO) {
      const registedUser = await this.prisma.$transaction(async () => {
        const newUser = await this.userService.createUser(registerUserDTO);
  
        const role = await this.roleService.findRole('PATIENT');
  
        if (!newUser?.id)
          throw new BadRequestException(
            'Não foi possivel encontrar o id do usuario.',
            {
              cause: new Error(),
              description:
                'Provavelmente o usuario não foi inserido na tabela User.',
            },
          );
  
        const userRole = {
          userId: newUser.id,
          roleId: role,
        };
  
        await this.userRoleService.create(userRole);
  
        return newUser;
      });
  
      const { passwordHash, createdAt, updatedAt, deletedAt, ...registerData } =
        registedUser;
  
      const loginPayload = {
        email: registerData.email,
        passwordHash: registerUserDTO.passwordHash,
      };
  
      const login = await this.login(loginPayload);
  
      return {
        message: 'Usuario cadastrado com sucesso!',
        user: registerData,
        token: login.token,
      };
    }
  }
  