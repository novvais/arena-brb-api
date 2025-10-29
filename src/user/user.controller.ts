import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { UpdateUserDTO } from './dtos/updateUser.dto';
  import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
  import { RolesGuard } from 'src/auth/roles/roles.guard';
  import { Roles } from 'src/auth/roles/roles.decorator';
  import { Role } from 'src/auth/roles/role.enum';
  import { UserService } from './user.service';
  import type { Request } from 'express';
  
  @Controller('user')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @UseGuards(JwtAuthGuard)
    @Patch('me')
    updateUser(@Req() req: Request, @Body() updateUser: UpdateUserDTO) {
      const userId = req.user!.id;
  
      return this.userService.updateUser(userId, updateUser);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    listUsers() {
      return this.userService.listUsers();
    }
  
    @UseGuards(JwtAuthGuard)
    @Get('me')
    detailProfile(@Req() req: Request) {
      const userId = req.user!.id;
  
      const dataUser = this.userService.findUserByID(userId)
  
      return dataUser;
    }
  
    @UseGuards(JwtAuthGuard)
    @Delete('me')
    deleteMyAccount(@Req() req: Request) {
      const userId = req.user!.id;
  
      return this.userService.deleteMyAccount(userId);
    }
  }
  