import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService
    ) {}

    @Post('login')
    async login(
        @Body() input: {email: string, password: string},
        @Res({passthrough: true} ) response: Response
      ) {
        return this.authService.authenticate(input);
      }
    
    @Post('signup')
      async signup(
        @Body() 
        input: {
            username: string,
            email: string,
            password: string
        }
      ) {
        const hashedPassword = await bcrypt.hash(input.password, 12);
    
        const user = await this.userService.create({
          username: input.username,
          email: input.email,
          password: hashedPassword
        });
        const {password: _password, ...result} = user;
        
        return result;
      }
}
