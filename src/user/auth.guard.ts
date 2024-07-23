import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { User } from './user.interface';

@Injectable()
export class AuthGuards extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext().req;
    const authHeader = ctx.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is not provided');
    }

    const token = this.extractTokenFromHeader(authHeader);
    ctx.user = await this.validateToken(token);

    let user: User = await this.userService.getUser(ctx.user._id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // validate current session
    if (user.accessToken != token) throw new UnauthorizedException('Session Expired');

    return true;
  }

  private extractTokenFromHeader(authHeader: string): string {
    if (authHeader.split(' ')[0] !== 'Bearer') {
      throw new UnauthorizedException('Invalid token format');
    }
    return authHeader.split(' ')[1];
  }

  private async validateToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (err) {
      let errorMessage = ''
      if (err.name === 'TokenExpiredError') {
        // Token has expired
        errorMessage = 'Token has expired';
      } else if (err.name === 'JsonWebTokenError') {
        // Invalid token
        errorMessage = 'Invalid token';
      } else {
        // Other errors
        errorMessage = 'Token validation error';
      }
      throw new UnauthorizedException(errorMessage || 'Invalid token');
    }
  }
}