import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm";

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
        length: 10,
        default: 'user',
    })
    role: 'admin' | 'user';
}