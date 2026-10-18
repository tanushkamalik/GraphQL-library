# GraphQL Book and Author API

A Node.js and Express application that provides a GraphQL API for managing books and authors. It demonstrates queries, mutations, input validation, relationships between books and authors, and custom error handling.

## Features

- Retrieve all books.
- Retrieve a book by ID.
- Retrieve all authors.
- Add new books and authors.
- Validate book and author input.
- Handle errors such as missing records, invalid input, and empty data.
- Return custom error messages and error codes.
- Explore queries and mutations using GraphiQL.

## Technologies Used

- Node.js
- Express.js
- GraphQL
- express-graphql

## Getting Started

### Prerequisites

Install Node.js and npm.

### Installation

Clone the repository and open the project directory in your terminal. Then install the dependencies:

```bash
npm install
```

### Run the Application

```bash
npm start
```

The server runs at:

`http://localhost:5000/graphql`

Open this URL in your browser to access the GraphiQL interface.

## Example Queries

### Get All Books

```graphql
{
  books {
    id
    title
    pages
  }
}
```

### Get All Authors

```graphql
{
  authors {
    id
    name
  }
}
```

### Add an Author

```graphql
mutation {
  addAuthor(name: "Jane Austen") {
    id
    name
  }
}
```

### Add a Book

```graphql
mutation {
  addBook(title: "Pride and Prejudice", pages: 432, authorId: "3") {
    id
    title
    pages
  }
}
```

The book mutation requires an existing author ID.

## Error Handling

The API includes custom error codes for cases such as:

- `NOT_FOUND` — requested book or author does not exist.
- `VALIDATION_ERROR` — input does not meet validation rules.
- `NO_DATA` — no books or authors are available.
- `INTERNAL_SERVER_ERROR` — an unexpected error occurs while adding a book.

## Data Storage

The project currently uses in-memory JavaScript arrays for books and authors. Data is not stored in a persistent database and resets when the server restarts.

## License

No license has been specified yet.
