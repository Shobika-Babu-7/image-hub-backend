import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateImageDto } from './dto/image.dto';
import { Image } from './image.interface';

@Injectable()
export class ImageService {
    constructor(@InjectModel('Image') private imageModel: Model<Image>) {}

    async createImage(createImageDto: CreateImageDto): Promise<Image> {
        const createdImage = new this.imageModel({...createImageDto, createdAt: new Date(), updatedAt: new Date()});
        return createdImage.save();
    }

    async findAll(user: string): Promise<Image[]> {
        return this.imageModel.find({user}).exec();
    }

    async delete(_id: string): Promise<Boolean> {
        this.imageModel.findByIdAndDelete({_id}).exec();
        return true
    }

}
