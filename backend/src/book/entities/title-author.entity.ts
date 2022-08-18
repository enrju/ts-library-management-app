import {
    BaseEntity,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { AuthorEntity } from "./author.entity";
import { TitleEntity } from "./title.entity";

@Entity()
export class TitleAuthorEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        type => TitleEntity,
        entity => entity.id
    )
    titleEntity: TitleEntity;

    @ManyToOne(
        type => AuthorEntity,
        entity => entity.id
    )
    authorEntity: AuthorEntity;
}