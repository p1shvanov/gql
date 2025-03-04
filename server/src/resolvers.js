const { PubSub, withFilter} = require("apollo-server");
const pubsub = new PubSub();
const COMMENT_ADDED = "COMMENT_ADDED";
const AUTHOR_ADDED = "AUTHOR_ADDED";

module.exports = {
  Query: {
    allBooks: async (_, {}, { dataSources }) => {
      return await dataSources.booksAPI.getAllBooks();
    },
    allAuthors: async (_, {}, { dataSources }) => {
      return await dataSources.authorsAPI.allAuthors();
    },
    getAuthor: async (_, { id }, { dataSources }) => {
      return await dataSources.authorsAPI.getAuthor(id);
    },
    getBook: async (_, { id }, { dataSources }) => {
      return await dataSources.booksAPI.getBook(id);
    },
    me: async (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
  },
  Mutation: {
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userAPI.findOrCreateUser({ email });
      if (user) return new Buffer(email).toString("base64");
    },
    addAuthor: async (_, { author }, { dataSources }) => {
      const newAuthor = await dataSources.authorsAPI.addAuthor(author);
      await pubsub.publish(AUTHOR_ADDED, { authorAdded: newAuthor });
      console.log("newAuthor added! ", newAuthor)
      if (newAuthor) return newAuthor;
    },
    addBook: async (_, { book }, { dataSources }) => {
      const newBook = await dataSources.booksAPI.addBook(book);
      if (newBook) return newBook;
    },
    editBook: async (_, { bookId, book }, { dataSources }) => {
      return await dataSources.booksAPI.editBook(bookId, book);
    },
    deleteBook: async (_, { bookId }, { dataSources }) => {
      return await dataSources.booksAPI.deleteBook(bookId);
    },
    addBookToAuthor: async (_, { bookId, authorId }, { dataSources }) => {
      const author = await dataSources.authorsAPI.addBookToAuthor(
        bookId,
        authorId
      );
      if (author) return author;
      return null;
    },
    deleteAuthor: async (_, { authorId }, { dataSources }) => {
      return await dataSources.authorsAPI.deleteAuthor(authorId);
    },
    addComment: async (_, params, { dataSources }) => {
      const newComment = await dataSources.booksAPI.addComment(params);
      // Extract the raw data values of the new comment
      const commentData = newComment.get({ plain: true });
      await pubsub.publish(COMMENT_ADDED, { commentAdded: commentData });
      return commentData;
    }
  },
  Subscription: {
    commentAdded: {
      subscribe: withFilter(
          () => pubsub.asyncIterator([COMMENT_ADDED]),
          (payload, variables) => {
            // Only send commentAdded events if the bookId matches
            return payload.commentAdded.bookId === +variables.bookId;
          }
      ),
    },
    authorAdded: {
      subscribe: () => pubsub.asyncIterator([AUTHOR_ADDED])
    }
  }
};
