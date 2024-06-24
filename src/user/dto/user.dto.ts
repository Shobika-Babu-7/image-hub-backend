import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

@InputType()
export class CreateUserDto{

    @Field()
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    readonly email: string

    @Field()
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    readonly password: string

}

@InputType()
export class LoginDto {
    
    @Field()
    @IsNotEmpty()
    @IsString()
    readonly email: string

    @Field()
    @IsNotEmpty()
    @IsString()
    readonly password: string

}