import {UserEntity} from "./user.entity";
import {pool} from "../utils/db";

export class UserRecord implements UserEntity {
    id: string;
    login: string;
    password: string;
    role: string;

    constructor(obj: UserEntity) {
        this.id = obj.id;
        this.login = obj.login;
        this.password = obj.password;
        this.role = obj.role;
    }

    static async find(login: string): Promise<UserRecord | null> {
        const [results]: any = await pool.execute(
            "SELECT `users`.`id`,`login`,`password`,`name` AS `role` FROM `users`" +
            "JOIN `user_roles` ON `users`.`user_role_id` = `user_roles`.`id`" +
            " WHERE `login` = :login", {
                login: login,
            });
        return results.length === 1 ? new UserRecord(results[0]) : null;
    }
}