import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ImageService } from './image.service';
import { Image } from "./image.interface";
import { CreateImageDto } from './dto/image.dto';
import { ImageModel } from './image.model';
import { Body, ExecutionContext, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuards } from 'src/user/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from './aws-s3.service';
// import {GraphQLUpload} from 'graphql-upload/GraphQLUpload.js';
// import { UploadScalar } from './image.scalar';
// @ts-ignore
import { GraphQLUpload, FileUpload } from 'graphql-upload';


@Resolver(of => ImageModel)
export class ImageResolver {
  constructor(private imageService: ImageService, private awsS3Service: AwsS3Service) { }

  @Query(() => [ImageModel])
  @UseGuards(AuthGuards)
  async getAllMyUploadedPictures(@Args('user') user: string): Promise<Image[] | Error> {
    try {
      return this.imageService.findAll(user);
    } catch (error) {
      throw new Error('Failed to fetch images');
    }
  }

  @UseGuards(AuthGuards)
  @Mutation(() => ImageModel)
  async uploadPicture(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
    @Context() { req }: { req: any },
  ): Promise<Image> {
    const { createReadStream, filename, mimetype } = await file;
    const stream = createReadStream();
    let location = await this.awsS3Service.uploadFile(stream, filename)
    let imageData: CreateImageDto = { image: location, mimeType: mimetype, user: req.user._id }
    return this.imageService.createImage(imageData);
  }

  @UseGuards(AuthGuards)
  @Mutation(() => Boolean)
  async deletePicture(@Args('picId') picId: string): Promise<Boolean> {
    return this.imageService.delete(picId);
  }
}
