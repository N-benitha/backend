import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserType } from 'src/user/entities/enums/user-type.enum';

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
        const result = await this.authService.authenticate(input);

        response.cookie('jwt', result?.user.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        const redirectPath = this.getRedirectPathByRole(result?.user.user_type ?? '');

        return {
            ...result,
            redirectPath
        };
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
        
        return {
            message: "User registered successfully",
            result
        };
    }

    @Post('logout')
    @UseGuards(AuthGuard)
    async logout(@Res({passthrough: true}) response: Response) {
        response.clearCookie('jwt', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return {
            message: 'Logout successful'
        };
    }

    @Get('me')
    @UseGuards(AuthGuard)
    async getCurrentUser(@CurrentUser() user: any) {
        const redirectPath = this.getRedirectPathByRole(user.user_type);

        return {
            message: 'User retrieved successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                user_type: user.user_type,
                status: user.status
            },
            redirectPath
        };
    }

    @Post('refresh')
    @UseGuards(AuthGuard)
    async refreshToken(
        @CurrentUser() user: any,
        @Res({ passthrough: true }) response: Response
    ) {
        // Generate a new token
        const result = await this.authService.signIn({
        userId: user.id,
        username: user.username,
        email: user.email,
        user_type: user.user_type,
        status: user.status,
        });

        // Set new JWT cookie
        response.cookie('jwt', result?.user.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        const redirectPath = this.getRedirectPathByRole(user.user_type);

        return {
        message: 'Token refreshed successfully',
        user: result?.user,
        redirectPath
        };
    }

    private getRedirectPathByRole(userType: string): string {
        switch(userType) {
            case UserType.ADMIN:
                return 'dashboards/admin';
            
            case UserType.APPROVER:
                return 'dashboards/approver';

            case UserType.DEVELOPER:
                return 'dashboards/developer';

            default:
                return '/dashboards'; //fallback roure
        }
    }

}
