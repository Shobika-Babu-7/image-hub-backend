import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserModel } from "./user.model";
import { UserService } from "./user.service";
import { CreateUserDto, LoginDto } from "./dto/user.dto";
import { User } from "./user.interface";

@Resolver(of => UserModel)
export class UserResolver {
    constructor(private userService: UserService) {}

    @Mutation(() => UserModel)
    async createAccount(@Args('createUserDto') createUserDto: CreateUserDto): Promise<User | Error> {
        return this.userService.create(createUserDto);
    }

    @Mutation(() => UserModel)
    async login(@Args('loginDto') loginDto: LoginDto): Promise<User | Error> {
        return this.userService.login(loginDto);
    }

    @Query(() => UserModel)
    async myProfile(@Args('userId') userId: String): Promise<User | Error> {
        return this.userService.getUser(userId);
    }
}