import {
    ConflictException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { User} from '@prisma/client';
  import { RegisterUserDTO } from './dtos/createUser.dto';
  import * as bcrypt from 'bcrypt';
  import { UpdateUserDTO } from './dtos/updateUser.dto';
  import { PrismaService } from 'src/prisma/prisma.service';
  
  @Injectable()
  export class UserService {
    constructor(private prisma: PrismaService) {}
  
    async createUser(registerUser: RegisterUserDTO): Promise<User | null> {
      const validateEmail = await this.prisma.user.findFirst({
        where: { email: registerUser.email, deletedAt: null },
      });
  
      if (validateEmail) {
        throw new ConflictException(
          'Já existe um usuário cadastrado com esse email!',
          {
            cause: new Error(),
            description:
              'Já existe um usuário com esse email cadastrado. Faça login ou altere o email!',
          },
        );
      }
  
      const encrypetedPassword = await bcrypt.hash(registerUser.passwordHash, 10);
  
      const newUser = await this.prisma.user.create({
        data: {
          ...registerUser,
          passwordHash: encrypetedPassword,
        },
      });
  
      const { passwordHash, createdAt, updatedAt, deletedAt, ...dataNewUser } =
        newUser;
  
      return dataNewUser as User;
    }
  
    async updateUser(
      userId: number,
      updateUser: UpdateUserDTO,
    ): Promise<User | null> {
      await this.findUserByID(userId);
  
      if (updateUser.email) {
        const validateEmail = await this.prisma.user.findFirst({
          where: {
            email: updateUser.email,
            deletedAt: null,
            NOT: { id: userId },
          },
        });
  
        if (validateEmail)
          throw new ConflictException('Email já cadastrado!', {
            cause: new Error(),
            description:
              'Existe um usuário com esse email cadastrado, insira um email diferente e tente novamente!',
          });
      }
  
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...updateUser,
        },
      });
  
      const {
        passwordHash,
        createdAt,
        updatedAt,
        deletedAt,
        ...dataUserUpdated
      } = updatedUser;
  
      return dataUserUpdated as User;
    }
  
    async listUsers(): Promise<User[] | []> {
      const users = await this.prisma.user.findMany({
        where: { deletedAt: null },
      });
  
      return users.map((user) => {
        const { passwordHash, ...datasUsers } = user;
  
        return datasUsers as User;
      });
    }
  
    async findUserByID(userId: number): Promise<User | null> {
      const validateUser = await this.prisma.user.findFirst({
        where: { id: userId, deletedAt: null },
      });
  
      if (!validateUser)
        throw new NotFoundException('ID inválido!', {
          cause: new Error(),
          description: 'Nenhum usuario encontrado com esse ID, insira outro',
        });
  
      const { passwordHash, createdAt, updatedAt, deletedAt, ...data } =
        validateUser;
  
      return data as User;
    }
  
    async findByIdWithRoles(id: number) {
      const user = await this.prisma.user.findFirst({
        where: { id },
        include: {
          userRole: {
            include: {
              role: true,
            },
          },
        },
      });
  
      if (!user)
        throw new NotFoundException('ID inválido.', {
          cause: new Error(),
          description:
            'Usuário não encontrado, id inválido, verifique e tente novamente.',
        });
  
      const { passwordHash, ...dataUser } = user;
  
      return dataUser;
    }
  
    async findUserByEmail(
      email: string,
      includePassword = false,
    ): Promise<User | null> {
      const validateEmail = await this.prisma.user.findFirst({
        where: { email, deletedAt: null },
      });
  
      if (!validateEmail) return null;
  
      if (includePassword) return validateEmail as User;
  
      const { passwordHash, createdAt, updatedAt, deletedAt, ...data } =
        validateEmail;
  
      return data as User;
    }
  
    //SoftDelete e HardDelete - De começo deletar a conta do usuario somente com o campo deletedAt e todos os registros dele, apos 30 dias fazer o Hard Delete.
    //Da para adicionar também uma lógica de somente suspender/desativar a conta, o usuário quer excluir sua conta, mas não sabe se vai ser pra sempre, usa a logica de SoftDelete.
    async deleteMyAccount(userId: number): Promise<{ message: string }> {
      const validateUser = await this.findUserByID(userId);
  
      if (!validateUser)
        throw new NotFoundException('Usuário não encontrado!', {
          cause: new Error(),
          description:
            'Usuário não foi encontrado, verifique o ID enviado e tente novamente.',
        });
  
      await this.prisma.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() },
      });
  
      // Soft delete dos user roles relacionados
      await this.prisma.userRole.updateMany({
        where: { userId },
        data: { deletedAt: new Date() },
      });
  
      return { message: 'Usuário deletado com sucesso!' };
    }
  }
  