import React from "react";
import { UserBook } from "types";
import './Books-list.scss';

interface Props {
    number: number;
    book: UserBook;
    children?: any;
    onAddButtons?: Function;
}

export const BooksListItem = (props: Props) => {
    return (
        <li className="Books-list-item">
            <p className="Books-list-item__column Books-list-item__column--no">{props.number}</p>
            <p className="Books-list-item__column">{props.book.title}</p>
            <p className="Books-list-item__column">{props.book.author}</p>
            {
                props.book.returnUntil
                    ? <p className="Books-list-item__column">{`ważne do: ${props.book.returnUntil.toLocaleString().substring(0, 10)}`}</p>
                    : props.book.state
                        ? <p className="Books-list-item__column">{`${props.book.state}`}</p>
                        : null
            }
            {
                props.children
                    ? <p className="Books-list-item__column Books-list-item__column--last">{props.children}</p>
                    : null
            }
            {
                props.onAddButtons
                    ? <p className="Books-list-item__column Books-list-item__column--last">
                        {props.onAddButtons(props.book.state, props.book.id)}
                    </p>
                    : null
            }
        </li>
    )
}