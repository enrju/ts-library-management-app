import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { BookEntity } from "../../book/entities/book.entity";
import { UserRole } from "../../types";

@Entity()
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 50,
    })
    name: string;

    @Column({
        length: 50,
    })
    surname: string;

    @Column({
        length: 255,
    })
    email: string;

    @Column()
    passwordHash: string;

    @Column({
        default: null,
        nullable: true,
    })
    currentTokenId: string | null;

    @Column({
        default: UserRole.User,
        length: 10,
    })
    role: UserRole;

    @OneToMany(
        type => BookEntity,
        entity => entity.userEntity,
    )
    bookEntity: BookEntity[];
}