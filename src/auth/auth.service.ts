import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

type AuthInput = { 
    email: string; 
    password: string;
};
type SignInData = { 
    userId: string;
    username: string;
    email: string;
    user_type: string;
    status: string;
};
type AuthResult = { 
    message: string;
    user: {
        accessToken: string;
        id: string;
        username: string;
        email: string;
        user_type: string;
        status: string;
    }
};

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    /**
     * Main authentication method that validates credentials and returns JWT token
     * @param input - User email and password
     * @returns AuthResult with access token and user data
     * @throws UnauthorizedException if credentials are invalid
     */
    async authenticate(input: AuthInput): Promise<AuthResult | null> {
        const user = await this.validateUser(input);

        if (!user) throw new UnauthorizedException('Invalid Credentials');

        return this.signIn(user);
    }
    
    /**
     * Validates user credentials against database
     * @param input - User email and password
     * @returns SignInData if credentials are valid, null otherwise
     */
    async validateUser(input: AuthInput): Promise<SignInData | null> {
        const user = await this.userService.findOne({where: {email: input.email}});

        if (user && (await bcrypt.compare(input.password, user.password))) {
            return {
                userId: user.id,
                username: user.username,
                email: user.email,
                user_type: user.user_type,
                status: user.status,
            };
        }
        return null;
    }

    /**
     * Generates JWT token for authenticated user
     * @param user - Validated user data
     * @returns AuthResult with JWT token and user information
     * @throws UnauthorizedException if token generation fails
     */
    async signIn(user: SignInData): Promise<AuthResult | null>  {
        try {
            const payload = { 
                id: user.userId,
                username: user.username,
                email: user.email,
                user_type: user.user_type,
                status: user.status,
            };

            const accessToken = await this.jwtService.signAsync(payload);          
        
            return {
                message: "Login successful",
                user: {
                    accessToken: accessToken,
                    id: user.userId,
                    username: user.username,
                    email: user.email,
                    user_type: user.user_type,
                    status: user.status,
                }
            };
        } catch (e) {
        throw new UnauthorizedException('Failed to generate token');
        }
    }
}
