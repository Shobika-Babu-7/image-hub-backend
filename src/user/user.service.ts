import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, LoginDto, UpdateDto } from './dto/user.dto';
import { User } from './user.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    constructor(
        @InjectModel('User') private userModel: Model<User>,
        private jwtService: JwtService
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User | Error> {
        try {
            const { name, email, password } = createUserDto;
            const newUser = new this.userModel({ name, email, password });
            let user: User = await newUser.save();
            let accessToken = await this.jwtService.sign({ _id: user._id, email, password });
            this.updateById({ userId: user._id, accessToken, authEnabled: false })
            user.accessToken = accessToken;
            user.authEnabled = false;
            return user
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async login(loginDto: LoginDto): Promise<User | Error> {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            let accessToken = await this.jwtService.sign({ _id: user._id, ...loginDto });
            this.updateById({ userId: user._id, accessToken, authEnabled: false })
            user.accessToken = accessToken;
            user.authEnabled = false;
            return user;
        } else throw new UnauthorizedException('Invalid email or password');
    }

    async getUser(userId: String): Promise<User> {
        const user = await this.userModel.findOne({ _id: userId });
        if (user) return user;
    }

    async updateById(updateDto: UpdateDto): Promise<User> {
        const { userId } = updateDto;
        return await this.userModel.findByIdAndUpdate(userId, updateDto, { new: true });
    }
}
