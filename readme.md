# Application "Library Management App"

## Description
It is an online library management application where users can borrow books for a certain period of time.
The application has two interfaces:
- User Interface
- Administrator's (librarian's) interface

Registered and logged in users can:
- browse books from the library
  (status should be visible: rented, available, booked)
- filter books by category, author, title
- reserve books for borrowing (only with state: available)
  (the rental based on the reservation is made by the admin)
- cancel own reservations
- view own account status
  (books borrowed, history of borrowings, reserved books)

Registered and logged in admins can:
- give reserved books (change of status to: borrowed)
- get borrowed books (status change to: available)
- browse user accounts (user account search by: user login)
- manage books: (view, add, delete, modify)
- track borrowed books and their availability
- cancel reservations
- bookings which have expired should be automatically canceled
  (1 day reservation is assumed)
- send reminders if the return deadline is exceeded
  (the borrowing period was assumed to be 14 days)

## Technology stack and techniques used
- MySQL
- Express.js
- HTML, CSS (temporary static front-end)

- TypeScript
- Active Record Pattern

## What has been implemented so far (version: 0.2.0 - prototype-1)
Due to a very extensive issue, the focus was first on the main functionalities of the application, i.e. user logging into the system, user panel management and administrator panel management.

1. Temporary front-end using static files on the backend in
   directory: public

2. Logging the user in and displaying the user/admin panel
   - it was assumed that we have user and admin accounts in DB (add manually)
   
     NOTE: at this stage we don't hash passwords, we keep them as plaintext in DB
   - only logging into the system
   - very simple authorization and authentication using:
     - cookies
     - an array with sessions (id, user-role)
   - after logging in, we check the user's permissions
   
3. Display the user panel
     - reserved books
     ("Cancel" button available)
     - borrowed books
     - all books in the library
     ("Reserve" button available)
     - cancelling the reservation
     ("Cancel" button)
     - reservation of an available book of books in the library
     ("Reserve" button)
     NOTE: borrowing and returning the book only via the admin

4. Displaying the admin panel
    - searching for a user by login
    - reserved books by a selected user (available buttons: "Cancel", "Rent")
    NOTE: rental only possible for earlier
    reserved books by the user
    - books borrowed by a selected user
    (available buttons: "Return")
    - all books in the library
    (available buttons: "Add new", "Edit", "Delete")
    - searching for a user
    (displays of his account status: books borrowed, reserved)
    ("Search" button)
    - cancelling the reservation
    ("Cancel" button) (works as in the user panel)
    - borrowing a book
    ("Rent" button)
    - take the book back to the library
    ("Return" button)
    - adding a new book to the library
    ("Add new book" button)
    - editing a book in the library (title, author)
    ("Edit" button)
    - deleting a book from the library
    (checking if the title and author are used in other books)
    (if not, we also delete the title and/or author)
    ("Delete" button)

## How to install
1. open the console
2. cd backend
3. npm install
4. run the XAMPP application (Apache and MySQL)
5. create any database (e.g. library_app)
6. import the sample database from db_example/db_tables_example.sql

## How to run
1. run the XAMPP application (Apache and MySQL)
2. open the console
3. cd backend
4. npm start
5. run the browser
6. enter: localhost:3001
7. enter: login and password (data in db_example in 'users' table)