import React from 'react';
import './App.scss';
import {getObjectOfCookies} from "../../utils/get-object-of-cookies";
import {UserRole} from 'types';

export const App = () => {
    const cookies = getObjectOfCookies();
    let whatDisplay = <h1>Coś poszło nie tak</h1>;

    if(cookies.logged) {
        switch(cookies.role) {
            case UserRole.User:
                whatDisplay = <h1>User Panel</h1>;
                break;
            case UserRole.Admin:
                whatDisplay = <h1>Admin Panel</h1>;
                break;
        }
    } else {
        if(cookies.isRegisterForm === 'false'
            || !cookies.isRegisterForm) {
            whatDisplay = <h1>Login Form</h1>;
        } else if(cookies.isRegisterForm === 'true') {
            whatDisplay = <h1>Register Form</h1>;
        }
    }

    return (
        <>
            {whatDisplay}
        </>
    )
}
