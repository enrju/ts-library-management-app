import { Injectable } from '@nestjs/common';
import { RegisterUserResponse } from "../types";
import { RegisterUserDto } from "./dto/register-user.dto";
import { UserEntity } from "./entities/user.entity";
import { hashText } from "../utils/hash";

@Injectable()
export class UserService {
    async register(registerUserDto: RegisterUserDto): Promise<RegisterUserResponse> {
        const user = new UserEntity();
        user.name = registerUserDto.name;
        user.surname = registerUserDto.surname;
        user.email = registerUserDto.email;
        user.passwordHash = await hashText(registerUserDto.password);

        await user.save();

        return {
            isSuccess: true,
            data: {
                id: user.id,
                email: user.email,
            }
        };
    }
}
