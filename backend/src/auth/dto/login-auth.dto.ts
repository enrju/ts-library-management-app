import { LoginAuthRequest } from "../../types";

export class LoginAuthDto implements LoginAuthRequest {
    email: string;
    password: string;
}