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
        private userSerice: UserService,
        private jwtService: JwtService,
    ) {}

    async authenticate(input: AuthInput): Promise<AuthResult | null> {
        const user = await this.validateUser(input);

        if (!user) throw new UnauthorizedException('Invalid Credentials');

        return this.signIn(user);
    }
        
    async validateUser(input: AuthInput): Promise<SignInData | null> {
        const user = await this.userSerice.findOne({where: {email: input.email}});

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
