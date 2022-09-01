import React, {useState} from 'react';
import './App.scss';
import {getObjectOfCookies} from "../../utils/get-object-of-cookies";
import {UserRole} from 'types';
import {LoginForm} from "../Form/Login-form";

export const App = () => {
    const [msgError, setMsgError] = useState<string | null>(null);
    const [showRegisterForm, setShowRegisterForm] = useState<boolean>(false);

    const cookies = getObjectOfCookies();

    let componentToDisplay = <h1>Coś poszło nie tak</h1>;

    if(cookies.logged) {
        switch(cookies.role) {
            case UserRole.User:
                componentToDisplay = <h1>User Panel</h1>;
                break;
            case UserRole.Admin:
                componentToDisplay = <h1>Admin Panel</h1>;
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
            componentToDisplay = <h1>Register Form</h1>;
        }
    }

    return (
        <>
            {componentToDisplay}
        </>
    )
}
