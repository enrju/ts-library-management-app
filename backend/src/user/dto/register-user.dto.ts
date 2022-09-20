import { RegisterUserRequest } from "../../types";

export class RegisterUserDto implements RegisterUserRequest {
    name: string;
    surname: string;
    email: string;
    password: string;
}