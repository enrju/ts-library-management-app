# Application "Library Management App"

## Description
It is an online library management application where users can borrow books for a certain period of time. The
application has two interfaces:

- User Interface
- Administrator's (librarian's) Interface

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

### Data-base
- MySQL

### Back-end
- Nest.js (TypeScript)
- TypeORM (MySQL)
- Active Record Pattern
- Type sharing between Front-end and Back-end
- Used packages:
  - bcrypt
  - cookie-parser
  - cors
  - mysql2
  - passport
  - passport-jwt
  - typeorm
  - uuid

### Front-end
- React.js (TypeScript)
- SCSS
- Controlled Component Technic
- Used packages:
  - node-sass

### (tmp) Front-end (static files)
- Express.js
- HTML, CSS in HTML, JavaScript (temporary static front-end)

## Database structure
<div align="center"> 
  <img src="https://user-images.githubusercontent.com/76522657/191216365-ca0c1e52-7c27-47da-b568-eb04fc7908ef.png" alt="screenshot" />
</div>

## Endpoints (REST API)
| HTTP method | endpoint | what does it do | access |
|-------------|----------|-----------------|--------|
| (POST) | http://localhost:3001/api/v1/auth/login | login user | user, admin |
| (GET) | http://localhost:3001/api/v1/auth/logout | logout user | user, admin |
| (POST) | http://localhost:3001/api/v1/books | add new book | admin |
| (GET) | http://localhost:3001/api/v1/books | get all books | user, admin |
| (GET) | http://localhost:3001/api/v1/books/:id | get a book with id | admin |
| (PATCH) | http://localhost:3001/api/v1/books/:id/state/:state | change state of book with id | user (available, reserved), admin (available, rented) |
| (PATCH) | http://localhost:3001/api/v1/books/:id | edit a book with id | admin |
| (DELETE) | http://localhost:3001/api/v1/books/:id | delete a book with id | admin |
| (POST) | http://localhost:3001/api/v1/users/register | register new user | --- |
| (GET) | http://localhost:3001/api/v1/users/id/books | get books for logged user | user |
| (GET) | http://localhost:3001/api/v1/users/:id/books | get books for selected user by admin | admin |
| (GET) | http://localhost:3001/api/v1/users/id/bylogin/:login | get user id by user login | admin |

## How does it work
<div align="center"> 
  <img src="https://user-images.githubusercontent.com/76522657/191238451-7d42646c-d7b8-44fd-8666-b05ad1cf3c0d.png" alt="screenshot" />
<img src="https://user-images.githubusercontent.com/76522657/191238619-17e98391-a87e-44a8-8a5e-21b1d0171fb7.png" alt="screenshot" />
<img src="https://user-images.githubusercontent.com/76522657/191238811-833fe149-95d4-4637-b1fd-ab7245653b1c.png" alt="screenshot" />
<img src="https://user-images.githubusercontent.com/76522657/191238993-1be27c92-bea4-48e8-b912-19498af27a59.png" alt="screenshot" />
<img src="https://user-images.githubusercontent.com/76522657/191239166-f1f9ce6e-775a-4fe3-b78d-1810a21f6bb8.png" alt="screenshot" />
<img src="https://user-images.githubusercontent.com/76522657/191239333-7beacbbe-b5b3-45cb-91a1-c9b5070e09f2.png" alt="screenshot" />
<img src="https://user-images.githubusercontent.com/76522657/191239505-2352a23c-be71-419d-81a2-595bd7847b41.png" alt="screenshot" />
</div>

## How to install
1. open the main project directory in the console
2. cd backend
3. npm install
4. run the XAMPP application (Apache and MySQL)
5. create any database (e.g. library_app)
6. import the sample database from db_example/v1_0_0_db_tables_example.sql
7. cd frontend
8. npm install
9. (optional) cd tmp_front_test_html
10. (optional) npm install

## How to run
1. run the XAMPP application (Apache and MySQL)
2. open the main project directory in the console
3. cd backend
4. nest start --watch [(optional): npx nest start --watch] (working on localhost:3001)
5. cd frontend
6. npm start (working on localhost:3000)
7. run the browser
8. enter: localhost:3000
9. enter: login and password (data in Data-base in 'user_entity' table, login: email, password: the beginning of the
   email, e.g. login: tester-1@test.com, password: tester-1)
10. (optional) open e.g. phpMyAdmin to see changes in Database tables