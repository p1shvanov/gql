const { gql } = require("apollo-server");

const typeDefs = gql`
  scalar Date
  type User {
    id: ID!
    email: String!
    login: String!
  }
  type Author {
    bio: String
    books: [Book!]
    firstname: String
    id: ID!
    lastname: String
    middlename: String
  }

  type Book {
    author: Author!
    description: String!
    id: ID!
    pubDate: Date
    title: String!
    comments: [Comment]
  }

  type Comment {
    author: String!
    id: ID!
    book: Book!
    pubDate: Date
    text: String!
  }

  input NewAuthorInput {
    bio: String!
    firstname: String!
    lastname: String!
    middlename: String!
  }

  input NewBookInput {
    description: String!
    pubDate: Date
    title: String!
  }

  input editBookInput {
    description: String
    pubDate: Date
    title: String
    authorId: ID!
    bookId: ID!
  }

  input NewComment {
    bookId: ID!
    author: String!
    text: String!
  }

  type Query {
    allAuthors: [Author!]!
    allBooks: [Book!]!
    getAuthor(id: ID!): Author
    getBook(id: ID!): Book
    me: User
  }
  type Mutation {
    login(email: String): String # login token
    addAuthor(author: NewAuthorInput): Author!
    deleteAuthor(authorId: ID!): String
    addBook(book: NewBookInput): Book!
    deleteBook(bookId: ID!): String
    editBook(bookId: ID!, book: editBookInput): Book!
    addBookToAuthor(bookId: ID!, authorId: ID!): Author!
    addComment(comment: NewComment!): Comment!
  }
  type Subscription {
    authorAdded: Author
    commentAdded(bookId: ID!): Comment
  }
`;

module.exports = typeDefs;
