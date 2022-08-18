import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { BookEntity } from "./book.entity";

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
}