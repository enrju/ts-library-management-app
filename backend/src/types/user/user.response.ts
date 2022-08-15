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