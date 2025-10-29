import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from 'src/user/dtos/createUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() registerUser: RegisterUserDTO) {
    const data = await this.authService.register(registerUser);

    return data;
  }

  @Post('/login')
  async login(@Body() loginUser: any) {
    const data = await this.authService.login(loginUser);

    return {
      message: 'Usuario logado com sucesso!',
      user: data,
    };
  }
}
