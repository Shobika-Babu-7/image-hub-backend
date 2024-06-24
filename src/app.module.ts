import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { ImageModule } from './image/image.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // make sure to load it as a global module
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req }) => ({ req }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // Destination folder for uploaded files
      }),
    }),
    UserModule,
    ImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
