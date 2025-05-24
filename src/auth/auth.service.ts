import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

type AuthInput = { email: string, password: string };
type SignInData = { userId: string, username: string, email: string, status: string };
type AuthResult = { 
    message: string,
    user: {
        accessToken: string, 
        id: string, 
        username: string,
        email: string,
        status: string
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

        if (!user) throw new UnauthorizedException();

        return this.signIn(user);
    }
        
    async validateUser(input: AuthInput): Promise<SignInData | null> {
        const user = await this.userSerice.findOne({where: {email: input.email}});

        if (user && await bcrypt.compare(user.password, input.password)) {
            return {
                userId: user.id,
                username: user.username,
                email: user.email,
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
                status: user.status 
            };
            
            const accessToken = await this.jwtService.signAsync(payload);          
        
            return {
                message: "Login successful",
                user: {
                    accessToken: accessToken,
                    id: user.userId,
                    username: user.username,
                    email: user.email,
                    status: user.status,
                }
            };
        } catch (e) {
        throw new UnauthorizedException();
        }
    }
}
