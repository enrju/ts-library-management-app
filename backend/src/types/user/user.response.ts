export type RegisterUserResponse = {
    isSuccess: true;
    data: {
        id: string;
        email: string;
    }
} | {
    isSuccess: false;
    msgError: string;
}

export type GetUserIdByLoginResponse = {
    isSuccess: true;
    data: {
        id: string;
    }
} | {
    isSuccess: false;
    msgError: string;
}