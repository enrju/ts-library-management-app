import { SetMetadata } from "@nestjs/common";

export const SetAccessForRoles = (accessForRoles: string[]) => {
    return SetMetadata('accessForRole', accessForRoles);
}