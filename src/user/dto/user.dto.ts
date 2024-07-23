import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

@InputType()
export class CreateUserDto {

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

@InputType()
export class UpdateDto {

	@Field()
	@IsNotEmpty()
	@IsString()
	readonly userId: string

	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	readonly accessToken?: string

	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	readonly secret?: string

	@Field({ nullable: true })
	@IsOptional()
	@IsBoolean()
	readonly authEnabled?: boolean

}

@ObjectType('UserModel')
export class UserModel {
	@Field(type => ID)
	_id: string;

	@Field()
	name: string;

	@Field()
	email: string

	@Field()
	password: string

	@Field()
	accessToken: string

	@Field()
	secret: string

	@Field()
	authEnabled: string
}

@ObjectType()
export class QRCodeResponse {
	@Field()
	qrCodeUrl: string;
}

@ObjectType()
export class VerifyCodeResponse {
	@Field()
	tokenVerified: boolean;

	@Field(() => UserModel)
	user: UserModel
}