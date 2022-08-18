import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { TitleAuthorEntity } from "./title-author.entity";

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
        type => TitleAuthorEntity,
        entity => entity.authorEntity,
    )
    titleAuthorEntity: TitleAuthorEntity[];
}