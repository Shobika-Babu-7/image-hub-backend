import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

@InputType()
export class CreateImageDto{

    @Field()
    @IsNotEmpty()
    @IsString()
    readonly image: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    readonly mimeType: string

    @Field()
    @IsNotEmpty()
    @IsString()
    readonly user: string

}