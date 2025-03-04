const { DataSource } = require("apollo-datasource");

class BooksAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  async getAllBooks() {
    return this.store.books.findAll({ include: ["author", "comments"] });
  }

  async getBook(id) {
    return this.store.books.findOne({
      where: { id },
      include: ["author", "comments"]
    });
  }

  async editBook(id, bookToEdit) {
    return await this.store.books.update(
      {
        authorId: bookToEdit.authorId
      },
      {
        where: { id }
      }
    );
  }

  async addBook(book) {
    const newBook = this.store.books.create(book);
    if (newBook) return newBook;
    return null;
  }

  async deleteBook(bookId) {
    const book = await this.store.books.findOne({
      where: { id: bookId }
    });
    console.log(book)
    if (book) {
      await this.store.books.destroy({
        where: { id: bookId }
      });
      return "ok";
    }
    return null;
  }

  async addComment(params) {
    // Find the book and include its existing comments
    const book = await this.store.books.findOne({
      where: { id: params.comment.bookId },
      include: ["comments"],
    });

    if (!book) {
      throw new Error("Book not found");
    }

    // Sync the comments table with the database schema
    await this.store.comments.sync();

    // Create the new comment, but don't set the bookId yet
    const newComment = await this.store.comments.create({
      author: params.comment.author,
      pubDate: params.comment.pubDate,
      text: params.comment.text,
    });

    // Associate the new comment with the book
    if (newComment) await book.addComments([newComment]);

    // Explicitly set the bookId on the new comment to ensure it's included
    newComment.bookId = book.id;

    // Return only the new comment with the bookId assigned
    return newComment;
  }
}

module.exports = BooksAPI;
