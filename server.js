const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema, GraphQLError } = require("graphql");

const app = express();

/* -----------------------------------------
   📌 GraphQL Schema
----------------------------------------- */
const schema = buildSchema(`
  type Book {
    id: ID!
    title: String!
    pages: Int!
    author: Author
  }

  type Author {
    id: ID!
    name: String!
    books: [Book!]
  }

  type Query {
    book(id: ID!): Book
    books: [Book!]!
    authors: [Author!]!
  }

  type Mutation {
    addBook(title: String!, pages: Int!, authorId: ID!): Book!
    addAuthor(name: String!): Author!
  }
`);

/* -----------------------------------------
   📚 Mock Database
----------------------------------------- */
let authors = [
  { id: "1", name: "J.K. Rowling" },
  { id: "2", name: "George R.R. Martin" },
];

let books = [
  { id: "1", title: "Harry Potter", pages: 350, authorId: "1" },
  { id: "2", title: "Game of Thrones", pages: 850, authorId: "2" },
];

/* -----------------------------------------
   ⚠ Custom Error Throw Utility
----------------------------------------- */
function throwError(message, code = "BAD_REQUEST") {
  throw new GraphQLError(message, { extensions: { code } });
}

/* -----------------------------------------
   🧠 Resolvers With Error Handling
----------------------------------------- */
const root = {
  /* ----- Get a single book ----- */
  book: ({ id }) => {
    const book = books.find((b) => b.id === id);
    if (!book) throwError(`Book with ID ${id} not found`, "NOT_FOUND");
    return book;
  },

  /* ----- Get all books ----- */
  books: () => {
    if (books.length === 0) throwError("No books available", "NO_DATA");
    return books;
  },

  /* ----- Get all authors ----- */
  authors: () => {
    if (authors.length === 0) throwError("No authors found", "NO_DATA");
    return authors;
  },

  /* ----- Add Author (Validation) ----- */
  addAuthor: ({ name }) => {
    if (name.trim().length < 3)
      throwError("Author name must be at least 3 characters", "VALIDATION_ERROR");

    const newAuthor = {
      id: String(authors.length + 1),
      name,
    };

    authors.push(newAuthor);
    return newAuthor;
  },

  /* ----- Add Book (Validation + Try/Catch) ----- */
  addBook: ({ title, pages, authorId }) => {
    if (title.trim().length < 3)
      throwError("Book title must be at least 3 characters", "VALIDATION_ERROR");

    if (pages <= 0)
      throwError("Pages must be greater than zero", "VALIDATION_ERROR");

    const author = authors.find((a) => a.id === authorId);
    if (!author) throwError("Invalid author ID", "NOT_FOUND");

    try {
      const newBook = {
        id: String(books.length + 1),
        title,
        pages,
        authorId,
      };

      books.push(newBook);
      return newBook;
    } catch (e) {
      throw new GraphQLError("Failed to add book", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  },

  /* ----- Field Resolvers ----- */
  Book: {
    author: (parent) => authors.find((a) => a.id === parent.authorId),
  },

  Author: {
    books: (parent) => books.filter((b) => b.authorId === parent.id),
  },
};

/* -----------------------------------------
   🔧 Custom Error Formatter
----------------------------------------- */
function customErrorFormatter(error) {
  return {
    message: error.message,
    code: error.extensions?.code || "INTERNAL_ERROR",
    path: error.path,
    locations: error.locations,
  };
}

/* -----------------------------------------
   🚀 Start GraphQL Endpoint
----------------------------------------- */
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
    customFormatErrorFn: customErrorFormatter,
  })
);

app.listen(5000, () =>
  console.log("GraphQL Library API running at http://localhost:5000/graphql")
);