import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, LoginDto } from './dto/user.dto';
import { User } from './user.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    constructor(
        @InjectModel('User') private userModel: Model<User>,
        private jwtService: JwtService
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { name, email, password } = createUserDto;
        const newUser = new this.userModel({ name, email, password });
        let user: User = await newUser.save();
        let accessToken = await this.jwtService.sign({_id: user._id, email, password});
        user.accessToken = accessToken;
        return user
    }

    async login(loginDto: LoginDto): Promise<User | Error> {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            let accessToken = await this.jwtService.sign({_id: user._id, ...loginDto});
            user.accessToken = accessToken;
            return user;
        } else throw new UnauthorizedException('Invalid email or password');
    }

    async getUser(userId: String): Promise<User | Error> {
        const user = await this.userModel.findOne({ _id: userId });
        if (user) return user;
        else throw new UnauthorizedException('Invalid email or password');
    }
}
