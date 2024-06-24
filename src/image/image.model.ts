import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType('ImageModel')
export class ImageModel {
    @Field(type => ID)
    _id: string;

    @Field()
    image: string;

    @Field()
    email: string

    @Field()
    mimeType: string

    @Field()
    createdAt: string

    @Field()
    updatedAt: string
}