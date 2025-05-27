import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    let token = this.extractTokenFromHeader(request);

    if (!token) {
      token = request.cookies?.jwt;
    }

    if (!token) throw new UnauthorizedException('No token provided');

    try {
      const tokenPayload = await this.jwtService.verifyAsync(token);
      const user = await this.userService.findOne({ where: { id: tokenPayload.id }});

      if (!user) throw new UnauthorizedException('User not found');

      request.user = {
        id: tokenPayload.id,
        username: tokenPayload.username,
        email: tokenPayload.email,
        user_type: tokenPayload.user_type,
        status: tokenPayload.status,
      }
      return true;

    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
