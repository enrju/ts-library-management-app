import React, {MouseEvent} from "react";
import './Header.scss';

interface Props {
    title: string;
    userName: string;
    userSurname: string;
}

export const Header = (props: Props) => {
    const logout = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const res = await fetch('http://localhost:3001/api/v1/auth/logout', {
            method: 'GET',
            credentials: "include",
        });
        const data = await res.json();

        document.location.reload();
    }

    return (
        <div className="Header">
            <h1 className="Header__title">{props.title}</h1>
            <p className="Header__user-introduction">
                {`Witaj: ${props.userName} ${props.userSurname}`}
            </p>
            <button
                className="Header__button-logout"
                onClick={logout}
            >Wyloguj</button>
        </div>
    )
}