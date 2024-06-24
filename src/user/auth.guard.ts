import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuards extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
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
    console.log(ctx.user)
    
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
        console.log(err)
      throw new UnauthorizedException('Invalid token');
    }
  }
}