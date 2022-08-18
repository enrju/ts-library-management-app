import {
    BaseEntity,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { BookEntity } from "./book.entity";
import { AuthorEntity } from "./author.entity";

@Entity()
export class BookAuthorEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        type => BookEntity,
        entity => entity.id
    )
    bookEntity: BookEntity;

    @ManyToOne(
        type => AuthorEntity,
        entity => entity.id
    )
    authorEntity: AuthorEntity;
}