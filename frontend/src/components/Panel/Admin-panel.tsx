import React, {useEffect, useState} from "react";
import './Panel.scss';
import {Header} from "../Header/Header";
import {Search} from "../Search/Search";
import {BooksList} from "../List/Books-list";
import {BooksListButton} from "../List/Books-list-button";
import {BookState, UserBook } from "types";

interface Props {
    userName: string;
    userSurname: string;
}

export const AdminPanel = (props: Props) => {
    const [userBooks, setUserBooks] = useState<UserBook[]>([]);
    const [reservedBooks, setReservedBooks] = useState<UserBook[]>([]);
    const [rentedBooks, setRentedBooks] = useState<UserBook[]>([]);

    const [libraryBooks, setLibraryBooks] = useState<UserBook[]>([]);

    const searchUserInputName = "user-login";
    const updateUserBooks = async (): Promise<void> => {
        const searchInput: HTMLInputElement | null = document.querySelector(`input[name=${searchUserInputName}]`);
        const login = searchInput ? searchInput.value : '';

        if(login === '') {
            setUserBooks([]);
            setReservedBooks([]);
            setRentedBooks([]);
        } else {
            const res = await fetch(`http://localhost:3001/api/v1/users/id/bylogin/${login}`, {
                method: 'GET',
                credentials: "include",
            });

            const data = await res.json();

            if(data.isSuccess) {
                const userId = data.data.id;

                // --- user books ---
                const userBooksRes = await fetch(`http://localhost:3001/api/v1/users/${userId}/books`, {
                    method: 'GET',
                    credentials: "include",
                });

                const userBooksData = await userBooksRes.json();
                const userBooks: UserBook[] = userBooksData.data;

                const reservedBooks = userBooks.filter(item => item.state === BookState.Reserved);
                const rentedBooks = userBooks.filter(item => item.state === BookState.Rented);

                setUserBooks(userBooks);
                setReservedBooks(reservedBooks);
                setRentedBooks(rentedBooks);
            } else {
                setUserBooks([]);
                setReservedBooks([]);
                setRentedBooks([]);
            }
        }


    }

    const updateLibraryBooks = async (): Promise<void> => {
        // --- all books ---
        const allBooksRes = await fetch('http://localhost:3001/api/v1/books', {
            method: 'GET',
            credentials: "include",
        });
        const allBooksData = await allBooksRes.json();
        const allBooks: UserBook[] = allBooksData.data;

        setLibraryBooks(allBooks);
    }

    useEffect(() => {
        (async () => {
            await updateLibraryBooks();
        })();
    }, []);

    const updateBookState = async (id: number, state: BookState) => {
        const res = await fetch(`http://localhost:3001/api/v1/books/${id}/state/${state}`, {
            method: 'PATCH',
            credentials: "include",
        });

        const data = await res.json();

        await updateUserBooks();
        await updateLibraryBooks();
    }

    const cancelReservation = async (id: number) => {
        const state = BookState.Available;

        await updateBookState(id, state);
    }

    const rentBook = async (id: number) => {
        const state = BookState.Rented;

        await updateBookState(id, state);
    }

    const returnBook = async (id: number) => {
        const state = BookState.Available;

        await updateBookState(id, state);
    }

    const deleteBook = async (id: number) => {
        const res = await fetch(`http://localhost:3001/api/v1/books/${id}`, {
            method: 'DELETE',
            credentials: "include",
        });

        const data = await res.json();

        await updateUserBooks();
        await updateLibraryBooks();
    }

    return (
        <div className="Panel">
            <div className="Panel__container">
                <Header
                    title="PANEL ADMINA"
                    userName={props.userName}
                    userSurname={props.userSurname}
                />

                <div className="Panel__section">
                    <Search
                        description="wpisz login użytkownika:"
                        name={searchUserInputName}
                        clickButton={updateUserBooks}
                    />

                    <BooksList
                        title="ZAREZERWOWANE KSIĄŻKI"
                        books={reservedBooks}
                        onAddButtons={(state: BookState, id: number) => {
                            if(state) {
                                return (
                                    <>
                                        <BooksListButton
                                            id={id}
                                            onClick={cancelReservation}
                                        >
                                            Anuluj
                                        </BooksListButton>

                                        <BooksListButton
                                            id={id}
                                            onClick={rentBook}
                                        >
                                            Wypożycz
                                        </BooksListButton>
                                    </>
                                )
                            }
                        }}
                    />

                    <BooksList
                        title="WYPOŻYCZONE KSIĄŻKI"
                        books={rentedBooks}
                        onAddButtons={(state: BookState, id: number) => {
                            if(state) {
                                return (
                                    <>
                                        <BooksListButton
                                            id={id}
                                            onClick={returnBook}
                                        >
                                            Oddaj
                                        </BooksListButton>
                                    </>
                                )
                            }
                        }}
                    />
                </div>

                <div className="Panel__section">
                    <BooksList
                        title="KSIĄŻKI W BIBLIOTECE"
                        books={libraryBooks}
                        searchDescription="wpisz tytuł lub autora:"
                        searchName="book-criteria"
                        searchOnClick={()=>{}}
                        jsx={
                            <BooksListButton
                                onClick={() => {}}
                            >
                                Dodaj nową książkę
                            </BooksListButton>
                        }
                        onAddButtons={(state: BookState, id: number) => {
                            if(state === BookState.Available) {
                                return (
                                    <>
                                        <BooksListButton
                                            id={id}
                                            onClick={()=>{}}
                                        >
                                            Edytuj
                                        </BooksListButton>

                                        <BooksListButton
                                            id={id}
                                            onClick={deleteBook}
                                        >
                                            Usuń
                                        </BooksListButton>
                                    </>
                                )
                            }

                            if(state === BookState.Reserved) {
                                return (
                                    <>
                                        <BooksListButton
                                            id={id}
                                            onClick={cancelReservation}
                                        >
                                            Anuluj
                                        </BooksListButton>
                                    </>
                                )
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}