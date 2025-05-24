import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization; // 'Bearer <token>'
    const token = authorization.split(' ')[1];

    if (!token) throw new UnauthorizedException();

    try {
      const tokenPayload = await this.jwtService.verifyAsync(token);
      request.user = {
        id: tokenPayload.id,
        username: tokenPayload.username,
        email: tokenPayload.email,
        status: tokenPayload.status,
      }
      return true;
      
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
