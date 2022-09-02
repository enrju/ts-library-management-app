import React, {ChangeEvent, FormEvent, MouseEvent, useState} from 'react';
import { LoginAuthRequest } from 'types';
import './Form.scss';

interface Props {
    msgError: string | null;
    setMsgError: Function;
    setShowRegisterForm: Function;
}

export const LoginForm = (props: Props) => {
    const [loginFormData, setLoginFormData] = useState<LoginAuthRequest>({
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
        <div className="Form__container">
            <form
                className="Form__form"
                onSubmit={submitForm}
            >
                <h2 className="Form__title">Zaloguj się</h2>
                <div className="Form__content">
                    <label className="Form__label">Email:
                        <input
                            className="Form__input"
                            type="text"
                            name="email"
                            value={loginFormData.email}
                            onChange={changeInput}
                        />
                    </label>
                    <label className="Form__label">Password:
                        <input
                            className="Form__input"
                            type="text"
                            name="password"
                            value={loginFormData.password}
                            onChange={changeInput}
                        />
                    </label>
                    {props.msgError ? <p className="Form__info">{props.msgError}</p> : null}

                    <button className="Form__button" type="submit">Zaloguj</button>

                    <div>
                        <button className="Form__button" onClick={clickBtnGoToRegister}>Idź do rejestracji</button>
                    </div>
                </div>
            </form>
        </div>
    )
}