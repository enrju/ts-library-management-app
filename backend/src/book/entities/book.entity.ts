import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { TitleEntity } from "./title.entity";
import { UserEntity } from "../../user/entities/user.entity";
import { BookAuthorEntity } from "./book-author.entity";
import { BookState } from "../../types";

@Entity()
export class BookEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        default: BookState.Available,
        length: 10,
    })
    state: BookState;

    @Column({
        default: null,
        nullable: true,
    })
    return_until: Date;

    @ManyToOne(
        type => TitleEntity,
        entity => entity.id,
    )
    titleEntity: TitleEntity;

    @ManyToOne(
        type => UserEntity,
        entity => entity.id,
    )
    userEntity: UserEntity;

    @OneToMany(
        type => BookAuthorEntity,
        entity => entity.bookEntity,
    )
    bookAuthorEntity: BookAuthorEntity[];
}