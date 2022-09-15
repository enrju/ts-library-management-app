import React from "react";
import { UserBook } from "types";
import './Books-list.scss';
import {BooksListItem} from "./Books-list-item";
import {Search} from "../Search/Search";

interface Props {
    title: string;
    books: UserBook[];
    children?: any;
    search?: string;
    onAddButtons?: Function;
}

export const BooksList = (props: Props) => {
    return (
        <div className="Books-list">
            <h2 className="Books-list__header">{props.title}</h2>
            {props.search ? <Search search={props.search} /> : null}
            <ul className="Books-list__list">
                {
                    props.books.map((item, index) =>
                        <BooksListItem
                            key={item.id}
                            number={index + 1}
                            book={item}
                            children={props.children}
                            onAddButtons={props.onAddButtons}
                        />
                    )
                }
            </ul>
        </div>
    )
}