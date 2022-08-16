export type LoginAuthResponse = {
    isSuccess: true;
} | {
    isSuccess: false;
    msgError: string;
}