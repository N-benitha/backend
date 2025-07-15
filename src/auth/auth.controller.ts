import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserType } from 'src/user/entities/enums/user-type.enum';

/**
 * Authentication controller handling user login, signup, logout, and token management.
 * 
 * Implements JWT-based authentication with HttpOnly cookies for security.
 * Provides role-based redirect paths for different user types in the change request system.
 * 
 * @controller auth
 */
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService
    ) {}

    /**
     * User login endpoint
     * 
     * Authenticates user credentials and sets secure JWT cookie.
     * Returns appropriate redirect path based on user role.
     */
    @Post('login')
    async login(
        @Body() input: {email: string, password: string},
        @Res({passthrough: true} ) response: Response
      ) {
        const result = await this.authService.authenticate(input);

        // Set secure JWT cookie with production-appropriate security settings
        response.cookie('jwt', result?.user.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours expiry
        });

        // Determine where to redirect user based on their role
        const redirectPath = this.getRedirectPathByRole(result?.user.user_type ?? '');

        return {
            ...result,
            redirectPath
        };
      }
    
    /**
     * User registration endpoint
     * 
     * Creates new user account with hashed password.
     * Note: New users have no role assigned initially.
     */
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

    /**
     * User logout endpoint
     * 
     * Clears JWT cookie to invalidate session.
     * Requires authentication to prevent unauthorized logout attempts.
     */
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

    /**
     * Get current authenticated user information
     * 
     * Returns user details and appropriate redirect path for their role.
     * Used for session validation and role-based routing.
     */
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

    /**
     * Refresh JWT token endpoint
     * 
     * Generates new token for authenticated user and updates cookie.
     * Extends user session without requiring re-authentication.
     */
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

    /**
     * Maps user roles to their respective dashboard routes
     * 
     * Implements role-based access control for the change request tracking system:
     * - Admin: Full system administration
     * - Approver: Change request approval workflow  
     * - Developer: Change request submission
     * 
     * @param userType - The user's role type
     * @returns Appropriate dashboard route for the user role
     */
    private getRedirectPathByRole(userType: string): string {
        switch(userType) {
            case UserType.ADMIN:
                return 'dashboards/admin';
            
            case UserType.APPROVER:
                return 'dashboards/approver';

            case UserType.DEVELOPER:
                return 'dashboards/developer';

            default:
                return '/dashboards'; //fallback route
        }
    }

}
