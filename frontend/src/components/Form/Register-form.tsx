import React, {ChangeEvent, FormEvent, MouseEvent, useState} from 'react';
import { RegisterUserRequest } from 'types';
import './Form.scss';

interface Props {
    msgError: string | null;
    setMsgError: Function;
    setShowRegisterForm: Function;
}

export const RegisterForm = (props: Props) => {
    const [registerFormData, setRegisterFormData] = useState<RegisterUserRequest>({
        name: '',
        surname: '',
        email: '',
        password: '',
    });

    const changeInput = (e: ChangeEvent<HTMLInputElement>) => {
        setRegisterFormData(prevRegisterFormData => {
            return {
                ...prevRegisterFormData,
                [e.target.name]: e.target.value,
            }
        });
    }

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const res = await fetch('http://localhost:3001/api/v1/users/register', {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify(registerFormData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();

        console.log('UWAGA - BEZ WALIDACJI (FE i BE) - puste pola też przechodzą')
        console.log(data);

        await props.setMsgError(data.msgError);
    }

    const clickBtnGoToHome = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        document.cookie = "isRegisterForm=false";
        props.setShowRegisterForm(false);
    }

    return (
        <div className="Form__container">
            <form
                className="Form__form"
                onSubmit={submitForm}
            >
                <h2 className="Form__title">Zarejestruj się</h2>
                <div className="Form__content">
                    <label className="Form__label">Imię:
                        <input
                            className="Form__input"
                            type="text"
                            name="name"
                            value={registerFormData.name}
                            onChange={changeInput}
                        />
                    </label>
                    <label className="Form__label">Nazwisko:
                        <input
                            className="Form__input"
                            type="text"
                            name="surname"
                            value={registerFormData.surname}
                            onChange={changeInput}
                        />
                    </label>
                    <label className="Form__label">Email:
                        <input
                            className="Form__input"
                            type="text"
                            name="email"
                            value={registerFormData.email}
                            onChange={changeInput}
                        />
                    </label>
                    <label className="Form__label">Password:
                        <input
                            className="Form__input"
                            type="text"
                            name="password"
                            value={registerFormData.password}
                            onChange={changeInput}
                        />
                    </label>
                    {props.msgError ? <p className="Form__info">{props.msgError}</p> : null}

                    <button className="Form__button" type="submit">Zarejestruj użytkownika</button>

                    <div>
                        <button className="Form__button" onClick={clickBtnGoToHome}>Idź do strony głównej</button>
                    </div>
                </div>
            </form>
        </div>
    )
}