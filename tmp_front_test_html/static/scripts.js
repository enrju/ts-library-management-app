const getObjectOfCookies = () => {
    const arrStr = (decodeURIComponent(document.cookie)).split('; ');

    arrStr.forEach((item, index) => {
        arrStr[index] = item.split('=');
    });

    arrStr.forEach((item, index) => {
        if(index < arrStr.length - 1) {
            arrStr[index] = '"' + item[0] + '":"' + item[1] + '",';
        } else {
            arrStr[index] = '"' + item[0] + '":"' + item[1] + '"';
        }
    });

    let str = "{";
    arrStr.forEach(item => {
        str += item;
    });
    str += "}";

    return JSON.parse(str);
}

const setHandleRegisterForm = async () => {
    const registerForm = await document.querySelector(".register-form");
    registerForm.addEventListener("submit", async e => {
        e.preventDefault();

        const res = await fetch('http://localhost:3001/api/v1/users/register', {
            method: 'POST',
            body: JSON.stringify({
                name: e.target.elements['name'].value,
                surname: e.target.elements['surname'].value,
                email: e.target.elements['email'].value,
                password: e.target.elements['password'].value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        console.log(data);
    });

    const goToHomeBtn = document.querySelector(".go-to-home");
    goToHomeBtn.addEventListener("click", e => {
        e.preventDefault();

        document.cookie = "isRegisterForm=false";
        document.location.href = "/";
    });
}
const getRegisterForm = async (div) => {
    const res = await fetch('/register-form.html', {
        method: 'GET',
    });

    const data = await res.text();

    div.innerHTML = data;

    document.body.appendChild(div);
    await setHandleRegisterForm();
}

const setHandleLoginForm = async () => {
    const loginForm = await document.querySelector(".login-form");
    loginForm.addEventListener("submit", async e => {
        e.preventDefault();

        const res = await fetch('http://localhost:3001/api/v1/auth/login', {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify({
                email: e.target.elements['email'].value,
                password: e.target.elements['password'].value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        console.log(data);
        document.location.href = "/";
    });

    const goToRegisterBtn = document.querySelector(".go-to-register");
    goToRegisterBtn.addEventListener("click", e => {
        e.preventDefault();

        document.cookie = "isRegisterForm=true";
        document.location.href = "/";
    });
}
const getLoginForm = async (div) => {
    const res = await fetch('/login-form.html', {
        method: 'GET',
    });

    const data = await res.text();

    div.innerHTML = data;

    document.body.appendChild(div);
    await setHandleLoginForm();
}

const setHandleLogoutBtn = async () => {
    const logoutBtn = document.querySelector(".logout-btn");
    logoutBtn.addEventListener("click", async e => {
        e.preventDefault();

        const res = await fetch('http://localhost:3001/api/v1/auth/logout', {
            method: 'GET',
            credentials: "include",
        });
        const data = await res.json();
        console.log(data);

        document.location.href = "/";
    });
}
const getLogoutBtn = async (div) => {
    const res = await fetch('/logout-btn.html', {
        method: 'GET',
    });

    const data = await res.text();

    div.innerHTML = data;

    document.body.appendChild(div);
    await setHandleLogoutBtn();
}

const setHandleUserPanel = async () => {
    const panel = document.querySelector(".panel");
    const userIntroduction = document.querySelector(".user-introduce");
    const ulReservedBooks = document.querySelector(".user-books-reserved");
    const ulRentedBooks = document.querySelector(".user-books-rented");
    const ulBooksInLibrary = document.querySelector(".books-in-library");

    const cookies = getObjectOfCookies();
    userIntroduction.textContent = `Witaj: ${cookies.name} ${cookies.surname}`;

    // --- user books ---
    const userBooksRes = await fetch('http://localhost:3001/api/v1/users/id/books', {
        method: 'GET',
        credentials: "include",
    });
    const userBooksData = await userBooksRes.json();
    const userBooks = userBooksData.data;

    if(userBooks) {
        const reservedBooks = userBooks
            .filter(item => item.state === 'reserved');

        if(reservedBooks.length > 0) {
            reservedBooks.forEach((item, index) => {
                const li = document.createElement("li");

                li.textContent =
                    String(index + 1) + " | " +
                    item.title + " | " +
                    item.author + " | " +
                    "ważne do: " + item.returnUntil.substring(0, 10) + " | ";

                const btn = document.createElement("button");
                btn.textContent = "Anuluj";
                btn.addEventListener("click", async e => {
                    e.preventDefault();
                    const id = item.id;
                    const state = 'available';

                    const res = await fetch(`http://localhost:3001/api/v1/books/${id}/state/${state}`, {
                        method: 'PATCH',
                        credentials: "include",
                    });

                    const data = await res.json();

                    location.reload();
                });
                li.appendChild(btn);

                ulReservedBooks.appendChild(li);
            });
        }

        const rentedBooks = userBooks
            .filter(item => item.state === 'rented');

        if(rentedBooks.length > 0) {
            rentedBooks.forEach((item, index) => {
                const li = document.createElement("li");
                li.textContent =
                    String(index + 1) + " | " +
                    item.title + " | " +
                    item.author + " | " +
                    "oddaj do: " + item.returnUntil.substring(0, 10) + " |";
                ulRentedBooks.appendChild(li);
            });
        }
    }

    // --- all books ---
    const allBooksRes = await fetch('http://localhost:3001/api/v1/books', {
        method: 'GET',
        credentials: "include",
    });
    const allBooksData = await allBooksRes.json();
    const allBooks = allBooksData.data;

    if(allBooks) {
        if(allBooks.length > 0) {
            allBooks.forEach((item, index) => {
                const li = document.createElement("li");
                li.textContent =
                    String(index + 1) + " | " +
                    item.title + " | " +
                    item.author + " | " +
                    item.state + " | ";

                if(item.state === 'available') {
                    const btn = document.createElement("button");
                    btn.textContent = "Rezerwuj";
                    btn.addEventListener("click", async e => {
                        e.preventDefault();
                        const id = item.id;
                        const state = 'reserved';

                        const res = await fetch(`http://localhost:3001/api/v1/books/${id}/state/${state}`, {
                            method: 'PATCH',
                            credentials: "include",
                        });

                        const data = await res.json();

                        location.reload();
                    });
                    li.appendChild(btn);
                }

                ulBooksInLibrary.appendChild(li);
            });
        }
    }
}
const getUserPanel = async (div) => {
    const logoutDiv = document.createElement('div');
    await getLogoutBtn(logoutDiv);

    const res = await fetch('/user-panel.html', {
        method: 'GET',
    });

    const data = await res.text();

    div.innerHTML = data;

    document.body.appendChild(div);
    await setHandleUserPanel();
}

const setHandleAddBookForm = async () => {
    const addBookForm = document.querySelector(".add-book-form");
    const addAuthorBtn = document.querySelector(".add-book-author");
    const authorsDiv = document.querySelector(".authors");
    const authors = [];

    const updateAuthors = () => {
        authorsDiv.textContent = "";
        if(authors.length > 0) {
            authorsDiv.textContent = "Autorzy:"
            authors.forEach(item => {
                const p = document.createElement("p");
                p.textContent = `${item.name} ${item.surname}`;
                authorsDiv.appendChild(p);
            });

        } else {
            authorsDiv.textContent = "nie dodado autora";
        }
    }

    updateAuthors();

    addAuthorBtn.addEventListener("click", e => {
        const authorName = document.querySelector('input[name="author-name"]').value;
        const authorSurname = document.querySelector('input[name="author-surname"]').value;

        authors.push({
            name: authorName,
            surname: authorSurname
        });

        updateAuthors();
    });

    addBookForm.addEventListener("submit", async e => {
        const title = e.target.elements['title'].value;

        const res = await fetch(`http://localhost:3001/api/v1/books`, {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify({
                title,
                author: authors,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await res.json();
    });
}
const getAddBookForm = async (div) => {
    const res = await fetch('/add-book-form.html', {
        method: 'GET',
    });

    const data = await res.text();

    div.innerHTML = data;

    await setHandleAddBookForm();
}

const clearOpenedEditForms = async () => {
    const allEditForms = document.querySelectorAll(".edit-book-form");

    allEditForms.forEach(item => {
        item.parentElement.innerText = "";
    });
}
const setHandleEditBookForm = async (bookId) => {
    const editBookForm = document.querySelector(".edit-book-form");
    const authorsDiv = document.querySelector(".authors");

    const editedBookRes = await fetch(`http://localhost:3001/api/v1/books/${bookId}`, {
        method: 'GET',
        credentials: "include",
    });

    const editedBookData = await editedBookRes.json();

    const titleInp = document.querySelector(".edit-book-form input[name='title']");
    titleInp.dataset.id = editedBookData.data.title.id;
    titleInp.value = editedBookData.data.title.title;

    editedBookData.data.author.forEach(item => {
        const div = document.createElement("div");
        const nameLbl = document.createElement("label");
        const surnameLbl = document.createElement("label");
        const nameInp = document.createElement("input");
        const surnameInp = document.createElement("input");

        nameLbl.textContent = "Autor (imię): ";
        nameInp.classList.add('name-inp')
        nameInp.dataset.id = item.id;
        nameInp.value = item.name;
        nameLbl.appendChild(nameInp);

        surnameLbl.textContent = "Autor (nazwisko): ";
        surnameInp.classList.add(('surname-inp'));
        surnameInp.dataset.id = item.id;
        surnameInp.value = item.surname;
        surnameLbl.appendChild(surnameInp);

        div.appendChild(nameLbl);
        div.appendChild(surnameLbl);

        authorsDiv.appendChild(div);
    });

    editBookForm.addEventListener("submit", async e => {
        e.preventDefault();

        const titleId = e.target.elements['title'].dataset.id;
        const title = e.target.elements['title'].value;
        const authors = [];

        const authorNames = document.querySelectorAll("input.name-inp");
        const authorSurnames = document.querySelectorAll("input.surname-inp");

        authorNames.forEach(item => {
            authors.push({id: item.dataset.id, name: item.value});
        });

        authorSurnames.forEach(item => {
            for(let i = 0; i < authors.length; i++) {
                if(authors[i].id === item.dataset.id) {
                    authors[i] = {
                        ...authors[i],
                        surname: item.value
                    }
                }
            }
        });

        const res = await fetch(`http://localhost:3001/api/v1/books/${bookId}`, {
            method: 'PATCH',
            credentials: "include",
            body: JSON.stringify({
                title: {id: titleId, title: title},
                author: authors,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await res.json();

        location.reload();
    });
}
const getEditBookForm = async (div, bookId) => {
    await clearOpenedEditForms();
    const res = await fetch('/edit-book-form.html', {
        method: 'GET',
    });

    const data = await res.text();

    div.innerHTML = data;

    await setHandleEditBookForm(bookId);
}

const setHandleAdminPanel = async () => {
    const panel = document.querySelector(".panel");
    const userIntroduction = document.querySelector(".user-introduce");
    const formSearchUser = document.querySelector(".search-user");
    const ulReservedBooks = document.querySelector(".user-books-reserved");
    const ulRentedBooks = document.querySelector(".user-books-rented");
    const panelAddBook = document.querySelector(".panel-add-book");
    const btnAddBook = document.querySelector(".btn-add-book");
    const ulBooksInLibrary = document.querySelector(".books-in-library");

    const cookies = getObjectOfCookies();
    userIntroduction.textContent = `Witaj: ${cookies.name} ${cookies.surname}`;

    formSearchUser.addEventListener("submit", async e => {
        e.preventDefault();

        const login = e.target.elements['user-login'].value;

        if(login.length === 0) {
            return;
        }

        const res = await fetch(`http://localhost:3001/api/v1/users/id/bylogin/${login}`, {
            method: 'GET',
            credentials: "include",
        });

        const data = await res.json();

        if(data) {
            const userId = data.data.id;

            // --- user books ---
            const userBooksRes = await fetch(`http://localhost:3001/api/v1/users/${userId}/books`, {
                method: 'GET',
                credentials: "include",
            });

            const userBooksData = await userBooksRes.json();
            const userBooks = userBooksData.data;

            if(userBooks) {
                const reservedBooks = userBooks
                    .filter(item => item.state === 'reserved');

                if(reservedBooks.length > 0) {
                    reservedBooks.forEach((item, index) => {
                        const li = document.createElement("li");

                        li.textContent =
                            String(index + 1) + " | " +
                            item.title + " | " +
                            item.author + " | " +
                            "ważne do: " + item.returnUntil.substring(0, 10) + " | ";

                        const btnCancel = document.createElement("button");
                        btnCancel.textContent = "Anuluj";
                        btnCancel.addEventListener("click", async e => {
                            e.preventDefault();
                            const id = item.id;
                            const state = 'available';

                            const res = await fetch(`http://localhost:3001/api/v1/books/${id}/state/${state}`, {
                                method: 'PATCH',
                                credentials: "include",
                            });

                            const data = await res.json();

                            location.reload();
                        });
                        li.appendChild(btnCancel);

                        const btnRent = document.createElement("button");
                        btnRent.textContent = "Wypożycz";
                        btnRent.addEventListener("click", async e => {
                            e.preventDefault();
                            const id = item.id;
                            const state = 'rented';

                            const res = await fetch(`http://localhost:3001/api/v1/books/${id}/state/${state}`, {
                                method: 'PATCH',
                                credentials: "include",
                            });

                            const data = await res.json();

                            location.reload();
                        });
                        li.appendChild(btnRent);

                        ulReservedBooks.appendChild(li);
                    });
                }

                const rentedBooks = userBooks
                    .filter(item => item.state === 'rented');

                if(rentedBooks.length > 0) {
                    rentedBooks.forEach((item, index) => {
                        const li = document.createElement("li");
                        li.textContent =
                            String(index + 1) + " | " +
                            item.title + " | " +
                            item.author + " | " +
                            "oddaj do: " + item.returnUntil.substring(0, 10) + " |";

                        const btnReturn = document.createElement("button");
                        btnReturn.textContent = "Oddaj";
                        btnReturn.addEventListener("click", async e => {
                            e.preventDefault();
                            const id = item.id;
                            const state = 'available';

                            const res = await fetch(`http://localhost:3001/api/v1/books/${id}/state/${state}`, {
                                method: 'PATCH',
                                credentials: "include",
                            });

                            const data = await res.json();

                            location.reload();
                        });
                        li.appendChild(btnReturn);

                        ulRentedBooks.appendChild(li);
                    });
                }

            }

        }
    });

    btnAddBook.addEventListener("click", async () => {
        await getAddBookForm(panelAddBook);
    });

    // --- all books ---
    const allBooksRes = await fetch('http://localhost:3001/api/v1/books', {
        method: 'GET',
        credentials: "include",
    });
    const allBooksData = await allBooksRes.json();
    const allBooks = allBooksData.data;

    if(allBooks) {
        if(allBooks.length > 0) {
            allBooks.forEach((item, index) => {
                const li = document.createElement("li");
                li.textContent =
                    String(index + 1) + " | " +
                    item.title + " | " +
                    item.author + " | " +
                    item.state + " | ";

                if(item.state === 'available') {
                    const div = document.createElement("div");

                    const btnEdit = document.createElement("button");
                    btnEdit.textContent = "Edytuj";
                    btnEdit.addEventListener("click", async e => {
                        // e.preventDefault();
                        const id = item.id;

                        await getEditBookForm(div, id);
                    });
                    li.appendChild(btnEdit);

                    const btnDelete = document.createElement("button");
                    btnDelete.textContent = "Usuń";
                    btnDelete.addEventListener("click", async e => {
                        e.preventDefault();
                        const id = item.id;

                        const res = await fetch(`http://localhost:3001/api/v1/books/${id}`, {
                            method: 'DELETE',
                            credentials: "include",
                        });

                        const data = await res.json();

                        location.reload();
                    });
                    li.appendChild(btnDelete);

                    li.appendChild(div);
                }

                if(item.state === 'reserved') {
                    const btn = document.createElement("button");
                    btn.textContent = "Anuluj";
                    btn.addEventListener("click", async e => {
                        e.preventDefault();
                        const id = item.id;
                        const state = 'available';

                        const res = await fetch(`http://localhost:3001/api/v1/books/${id}/state/${state}`, {
                            method: 'PATCH',
                            credentials: "include",
                        });

                        const data = await res.json();

                        location.reload();
                    });
                    li.appendChild(btn);
                }

                ulBooksInLibrary.appendChild(li);
            });
        }
    }
}
const getAdminPanel = async (div) => {
    const logoutDiv = document.createElement('div');
    await getLogoutBtn(logoutDiv);

    const res = await fetch('/admin-panel.html', {
        method: 'GET',
    });

    const data = await res.text();

    div.innerHTML = data;

    document.body.appendChild(div);
    await setHandleAdminPanel();
}

(async () => {
    const cookies = getObjectOfCookies();
    const div = document.createElement("div");

    if(cookies.logged) {
        switch(cookies.role) {
            case 'user':
                await getUserPanel(div);
                break;
            case 'admin':
                await getAdminPanel(div);
                break;
        }
    } else {
        if(cookies.isRegisterForm === 'false'
            || !cookies.isRegisterForm) {
            await getLoginForm(div);
        } else if(cookies.isRegisterForm === 'true') {
            await getRegisterForm(div);
        }
    }
})();