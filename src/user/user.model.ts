import { Field, ID, ObjectType } from "@nestjs/graphql";

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
}