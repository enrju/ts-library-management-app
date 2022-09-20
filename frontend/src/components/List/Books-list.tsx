import React from "react";
import { UserBook } from "types";
import './Books-list.scss';
import {BooksListItem} from "./Books-list-item";
import {Search} from "../Search/Search";

interface Props {
    title: string;
    books: UserBook[];
    children?: any;
    searchDescription?: string;
    searchName?: string;
    searchOnClick?: any;
    jsx?: any;
    onAddButtons?: Function;
}

export const BooksList = (props: Props) => {
    return (
        <div className="Books-list">
            <h2 className="Books-list__header">{props.title}</h2>
            {props.searchDescription && props.searchName
                ? <Search
                    description={props.searchDescription}
                    name={props.searchName}
                    clickButton={props.searchOnClick}
                />
                : null}
            {props.jsx ? <div className="Books-list__div">{props.jsx}</div> : null}
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