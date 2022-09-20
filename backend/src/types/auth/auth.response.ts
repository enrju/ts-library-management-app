export type LoginAuthResponse = {
    isSuccess: true;
} | {
    isSuccess: false;
    msgError: string;
}

export type LogoutAuthResponse = {
    isSuccess: true;
} | {
    isSuccess: false;
    msgError: string;
}