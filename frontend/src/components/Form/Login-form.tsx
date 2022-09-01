import React, {ChangeEvent, FormEvent, MouseEvent, useState} from 'react';
import './Login-form.scss';

export const LoginForm = (props: any) => {
    const [loginFormData, setLoginFormData] = useState({
        email: '',
        password: '',
    });

    const changeInput = (e: ChangeEvent<HTMLInputElement>) => {
        setLoginFormData(prevLoginFormData => {
            return {
                ...prevLoginFormData,
                [e.target.name]: e.target.value,
            }
        });
    }

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const res = await fetch('http://localhost:3001/api/v1/auth/login', {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify(loginFormData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();

        await props.setMsgError(data.msgError);
    }

    const clickBtnGoToRegister = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        document.cookie = "isRegisterForm=true";
        props.setShowRegisterForm(true);
    }

    return (
        <div className="Login-form__container">
            <form
                className="Login-form__form"
                onSubmit={submitForm}
            >
                <h2 className="Login-form__title">Zaloguj się</h2>
                <div className="Login-form__content">
                    <label className="Login-form__label">Email:
                        <input
                            className="Login-form__input"
                            type="text"
                            name="email"
                            value={loginFormData.email}
                            onChange={changeInput}
                        />
                    </label>
                    <label className="Login-form__label">Password:
                        <input
                            className="Login-form__input"
                            type="text"
                            name="password"
                            value={loginFormData.password}
                            onChange={changeInput}
                        />
                    </label>
                    {props.msgError ? <p className="Login-form__info">{props.msgError}</p> : null}

                    <button className="Login-form__button" type="submit">Zaloguj</button>

                    <div>
                        <button className="Login-form__button" onClick={clickBtnGoToRegister}>Idź do rejestracji</button>
                    </div>
                </div>
            </form>
        </div>
    )
}