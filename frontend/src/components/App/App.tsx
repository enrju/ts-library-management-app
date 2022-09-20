import React, {useState} from 'react';
import './App.scss';
import {getObjectOfCookies} from "../../utils/get-object-of-cookies";
import {UserRole} from 'types';
import {LoginForm} from "../Form/Login-form";
import {RegisterForm} from "../Form/Register-form";
import {UserPanel} from "../Panel/User-panel";
import {AdminPanel} from "../Panel/Admin-panel";

export const App = () => {
    const [msgError, setMsgError] = useState<string | null>(null);
    const [showRegisterForm, setShowRegisterForm] = useState<boolean>(false);

    const cookies = getObjectOfCookies();

    let componentToDisplay = <h1>Coś poszło nie tak</h1>;

    if(cookies.logged) {
        switch(cookies.role) {
            case UserRole.User:
                componentToDisplay =
                    <UserPanel
                        userName={cookies.name}
                        userSurname={cookies.surname}
                    />;
                break;
            case UserRole.Admin:
                componentToDisplay =
                    <AdminPanel
                        userName={cookies.name}
                        userSurname={cookies.surname}
                    />;;
                break;
        }
    } else {
        if(cookies.isRegisterForm === 'false'
            || !cookies.isRegisterForm) {
            componentToDisplay =
                <LoginForm
                    msgError={msgError}
                    setMsgError={setMsgError}
                    setShowRegisterForm={setShowRegisterForm}
                />;
        } else if(cookies.isRegisterForm === 'true') {
            componentToDisplay =
                <RegisterForm
                    msgError={msgError}
                    setMsgError={setMsgError}
                    setShowRegisterForm={setShowRegisterForm}
                />;
        }
    }

    return (
        <>
            {componentToDisplay}
        </>
    )
}
