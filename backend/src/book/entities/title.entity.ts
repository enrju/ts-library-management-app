import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { BookEntity } from "./book.entity";
import { TitleAuthorEntity } from "./title-author.entity";

@Entity()
export class TitleEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 200,
    })
    title: string;

    @OneToMany(
        type => BookEntity,
        entity => entity.titleEntity,
    )
    bookEntity: BookEntity[];

    @OneToMany(
        type => TitleAuthorEntity,
        entity => entity.titleEntity,
    )
    titleAuthorEntity: TitleAuthorEntity[];
}