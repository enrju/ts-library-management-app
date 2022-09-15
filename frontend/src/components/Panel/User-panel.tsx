import React, {useEffect, useState} from "react";
import './Panel.scss';
import {Header} from "../Header/Header";
import {BooksList} from "../List/Books-list";
import { BookState, UserBook } from "types";
import {BooksListButton} from "../List/Books-list-button";

interface Props {
    userName: string;
    userSurname: string;
}

export const UserPanel = (props: Props) => {
    const [userBooks, setUserBooks] = useState<UserBook[]>([]);
    const [reservedBooks, setReservedBooks] = useState<UserBook[]>([]);
    const [rentedBooks, setRentedBooks] = useState<UserBook[]>([]);

    const [libraryBooks, setLibraryBooks] = useState<UserBook[]>([]);

    const updateBooks = async (): Promise<void> => {
        // --- user books ---
        const userBooksRes = await fetch('http://localhost:3001/api/v1/users/id/books', {
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
            await updateBooks();
        })();
    }, []);

    const updateBookState = async (id: number, state: BookState) => {
        const res = await fetch(`http://localhost:3001/api/v1/books/${id}/state/${state}`, {
            method: 'PATCH',
            credentials: "include",
        });

        const data = await res.json();

        await updateBooks();
    }

    const cancelReservation = async (id: number) => {
        const state = BookState.Available;

        await updateBookState(id, state);
    }

    const makeReservation = async (id: number) => {
        const state = BookState.Reserved;

        await updateBookState(id, state);
    }

    return (
        <div className="Panel">
            <div className="Panel__container">
                <Header
                    userName={props.userName}
                    userSurname={props.userSurname}
                />

                <div className="Panel__content">
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
                                    </>
                                )
                            }
                        }}
                    />

                    <BooksList
                        title="WYPOŻYCZONE KSIĄŻKI"
                        books={rentedBooks}
                    />

                    <BooksList
                        title="KSIĄŻKI W BIBLIOTECE"
                        books={libraryBooks}
                        search="wpisz tytuł lub autora:"
                        onAddButtons={(state: BookState, id: number) => {
                            if(state === BookState.Available) {
                                return (
                                    <>
                                        <BooksListButton
                                            id={id}
                                            onClick={makeReservation}
                                        >
                                            Rezerwuj
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