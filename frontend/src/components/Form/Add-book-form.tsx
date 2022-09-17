import React, {ChangeEvent, FormEvent, useState} from 'react';
import { CreateBookRequest } from 'types';
import './Form.scss';

interface Props {
    setShowForm: Function;
}

export const AddBookForm = (props: Props) => {
    const [createBookFormData, setCreateBookFormData] = useState<CreateBookRequest>({
        title: '',
        author: [],
    });

    const changeInput = (e: ChangeEvent<HTMLInputElement>) => {
        setCreateBookFormData(prevCreateBookFormData => {
            return {
                ...prevCreateBookFormData,
                [e.target.name]: e.target.value,
            }
        });
    }

    const clickBtnAddAuthor = () => {
        const authorNameInput: HTMLInputElement | null = document.querySelector('input[name="author-name"]');
        const authorSurnameInput: HTMLInputElement | null = document.querySelector('input[name="author-surname"]');

        if(authorNameInput && authorSurnameInput) {
            const authorName = authorNameInput.value;
            const authorSurname = authorSurnameInput.value;

            setCreateBookFormData(prevCreateBookFormData => {
                const newAuthor = [...prevCreateBookFormData.author];
                newAuthor.push({
                    name: authorName,
                    surname: authorSurname
                });

                const newData = {
                    ...prevCreateBookFormData,
                    author: newAuthor,
                }

                return newData;
            });
        }
    }

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        const res = await fetch(`http://localhost:3001/api/v1/books`, {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify(createBookFormData),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await res.json();

        props.setShowForm(false);
    }

    return (
        <form
            className="Form--add-book"
            onSubmit={submitForm}
        >
            <h2 className="Form__title">Dodawanie nowej książki</h2>
            <div className="Form__content">
                <label className="Form__label">Tytuł:
                    <input
                        className="Form__input"
                        type="text"
                        name="title"
                        value={createBookFormData.title}
                        onChange={changeInput}
                    />
                </label>

                <div>
                    {
                        createBookFormData.author.length > 0
                            ? createBookFormData.author.map(item => {
                                return (<p>{item.name} {item.surname}</p>)
                            })
                            : <p className="Form__info">nie dodano autora</p>
                    }
                </div>

                <label className="Form__label">Autor (imię):
                    <input
                        className="Form__input"
                        type="text"
                        name="author-name"
                    />
                </label>

                <label className="Form__label">Autor (nazwisko):
                    <input
                        className="Form__input"
                        type="text"
                        name="author-surname"
                    />
                </label>

                <button
                    className="Form__button"
                    type="button"
                    onClick={clickBtnAddAuthor}
                >
                    Dodaj autora
                </button>

                <button
                    className="Form__button"
                    type="submit"
                >
                    Dodaj książkę
                </button>
            </div>
        </form>
    )
}