import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GetUserBooksRespons, GetUserIdByLoginResponse, RegisterUserResponse } from "../types";
import { RegisterUserDto } from "./dto/register-user.dto";
import { UserEntity } from "./entities/user.entity";
import { hashText } from "../utils/hash";
import { BookService } from "../book/book.service";

@Injectable()
export class UserService {
    constructor(
        @Inject(forwardRef(() => BookService)) private bookService: BookService,
    ) {
    }

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

    async getUserBooks(userId: string): Promise<GetUserBooksRespons> {
        return this.bookService.getUserBooks(userId);
    }

    async getUserIdByLogin(userLogin: string): Promise<GetUserIdByLoginResponse> {
        try {
            const user = await UserEntity.findOneOrFail({
                where: {
                    email: userLogin,
                }
            });

            if(user) {
                return {
                    isSuccess: true,
                    data: {
                        id: user.id,
                    }
                }
            } else {
                throw new Error("User for this login don't exist");
            }
        } catch(e) {
            return {
                isSuccess: false,
                msgError: e.message,
            };
        }
    }
}
