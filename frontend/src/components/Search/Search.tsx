import React from "react";
import './Search.scss';

interface Props {
    search: string
}

export const Search = (props: Props) => {
    return (
        <div className="Search">
            <label className="Search__label">{props.search}
                <input className="Search__input" type="text"/>
            </label>
            <button className="Search__button">Szukaj</button>
        </div>
    )
}