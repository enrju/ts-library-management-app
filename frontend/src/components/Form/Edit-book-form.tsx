import React, {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState
} from 'react';
import {BookAuthor, UpdateBookRequest} from 'types';
import './Form.scss';

interface Props {
    bookId: number;
    setShowEditBookFormForBookId: Function;
}

export const EditBookForm = (props: Props) => {
    const [editBookFormData, setEditBookFormData] = useState<UpdateBookRequest>({
        title: null,
        author: [],
    });

    useEffect(() => {
        (async () => {
            const editedBookRes = await fetch(`http://localhost:3001/api/v1/books/${props.bookId}`, {
                method: 'GET',
                credentials: "include",
            });

            const editedBookData = await editedBookRes.json();

            setEditBookFormData(editedBookData.data);

            console.log(editedBookData.data);
        })();
    }, []);

    const changeInput = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.name) {
            setEditBookFormData(prevEditBookFormData => {
                let title = prevEditBookFormData.title;

                if(title) {
                    title = {
                        ...title,
                        title: e.target.value,
                    }
                }

                return {
                    ...prevEditBookFormData,
                    title,
                }
            });


        } else {
            setEditBookFormData(prevEditBookFormData => {
                const newAuthor = [...prevEditBookFormData.author];
                const index = Number(e.target.dataset.index);

                if(e.target.classList.contains('name-inp')) {
                    newAuthor[index] = {
                        ...newAuthor[index],
                        name: e.target.value,
                    }
                }

                if(e.target.classList.contains('surname-inp')) {
                    newAuthor[index] = {
                        ...newAuthor[index],
                        surname: e.target.value,
                    }
                }

                return {
                    ...prevEditBookFormData,
                    author: newAuthor,
                }
            });
        }
    }

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        const res = await fetch(`http://localhost:3001/api/v1/books/${props.bookId}`, {
            method: 'PATCH',
            credentials: "include",
            body: JSON.stringify(editBookFormData),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await res.json();

        console.log(editBookFormData);

        props.setShowEditBookFormForBookId(null);
    }

    return (
        <form
            className="Form--edit-book"
            onSubmit={submitForm}
        >
            <h2 className="Form__title">Edytowanie książki</h2>
            <div className="Form__content">
                <label className="Form__label">Tytuł:
                    <input
                        className="Form__input"
                        type="text"
                        name="title"
                        value={editBookFormData.title ? editBookFormData.title.title : ''}
                        onChange={changeInput}
                    />
                </label>

                <div>
                    {
                        editBookFormData.author.length > 0
                            ? editBookFormData.author.map((item, index) => {
                                return (
                                    <div>
                                        <label className="Form__label--edit">Autor (imię):
                                            <input
                                                className="Form__input name-inp"
                                                data-index={index}
                                                type="text"
                                                value={item.name}
                                                onChange={changeInput}
                                            />
                                        </label>
                                        <label className="Form__label--edit">Autor (nazwisko): :
                                            <input
                                                className="Form__input surname-inp"
                                                data-index={index}
                                                type="text"
                                                value={item.surname}
                                                onChange={changeInput}
                                            />
                                        </label>
                                    </div>
                                )
                            })
                            : <p className="Form__info">nie dodano autora</p>
                    }
                </div>

                <button
                    className="Form__button"
                    type="submit"
                >
                    Edytuj książkę
                </button>
            </div>
        </form>
    )
}