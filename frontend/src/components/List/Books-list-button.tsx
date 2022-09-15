import React from "react";

interface Props {
    id: number;
    onClick: Function;
    children?: any;
}

export const BooksListButton = (props: Props) => {
    return (
        <button
            className="Books-list-item__button"
            onClick={() => props.onClick(props.id)}
        >
            {props.children}
        </button>
    )
}