import React from "react";
import './Search.scss';

interface Props {
    description: string;
    name: string;
    clickButton: any;
}

export const Search = (props: Props) => {
    return (
        <div
            className="Search"
        >
            <label className="Search__label">{props.description}
                <input className="Search__input" type="text" name={props.name}/>
            </label>
            <button
                className="Search__button"
                onClick={props.clickButton}
            >Szukaj</button>
        </div>
    )
}