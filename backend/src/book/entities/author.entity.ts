import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { BookAuthorEntity } from "./book-author.entity";

@Entity()
export class AuthorEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50,
    })
    name: string;

    @Column({
        length: 50,
    })
    surname: string;

    @OneToMany(
        type => BookAuthorEntity,
        entity => entity.authorEntity,
    )
    bookAuthorEntity: BookAuthorEntity[];
}