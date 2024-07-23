import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { CreateUserDto, LoginDto, QRCodeResponse, UserModel, VerifyCodeResponse } from "./dto/user.dto";
import { QRCode, Secret, User, VerifyCode } from "./user.interface";
import { TwoFactorAuthService } from "./twoFactorAuth.service";
import { UnauthorizedException } from "@nestjs/common";

@Resolver(of => UserModel)
export class UserResolver {

    constructor(
        private userService: UserService,
        private twoFactorAuthService: TwoFactorAuthService
    ) { }

    @Mutation(() => UserModel)
    async createAccount(@Args('createUserDto') createUserDto: CreateUserDto): Promise<User | Error> {
        return this.userService.create(createUserDto);
    }

    @Mutation(() => UserModel)
    async login(@Args('loginDto') loginDto: LoginDto): Promise<User | Error> {
        return this.userService.login(loginDto);
    }

    @Query(() => UserModel)
    async myProfile(@Args('userId') userId: string): Promise<User | Error> {
        return this.userService.getUser(userId);
    }

    @Mutation(() => QRCodeResponse)
    async generateQrCode(@Args('userId') userId: string): Promise<QRCode | Error> {
        let user: any = await this.userService.getUser(userId);
        let secret: Secret;
        if (!user?.secret) {
            secret = await this.twoFactorAuthService.generateSecret(user?.email);
            this.userService.updateById({ userId, secret: secret.base32 })
        } else secret = user.secret;
        const qrCodeUrl: string = await this.twoFactorAuthService.generateQrCode(secret);
        return { qrCodeUrl };
    }

    @Mutation(() => VerifyCodeResponse)
    async verifyToken(@Args('code') code: string, @Args('userId') userId: string): Promise<VerifyCode | Error> {
        let user: any = await this.userService.getUser(userId);
        const isValid = this.twoFactorAuthService.verifyToken(code, user.secret);
        if (isValid && !user.authEnabled) {
            user.authEnabled = true;
            this.userService.updateById({ userId, authEnabled: true })
        }
        if (!isValid) {
            throw new UnauthorizedException('Invalid 2FA code');
        } else return { user, tokenVerified: true };
    }
}