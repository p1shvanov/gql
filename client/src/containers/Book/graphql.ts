import { gql } from '@apollo/client'

export const GET_BOOK_BY_ID = gql`
  query getBook($id: ID!) {
    getBook(id: $id) {
      id
      description
      title
      pubDate
      author {
        id
        lastname
        firstname
      }
      comments {
        id
        author
        text
      }
    }
  }
`

export const ADD_COMMENT_TO_BOOK = gql`
  mutation AddComment($comment: NewComment!) {
    addComment(comment: $comment) {
      id
      author
      text
    }
  }
`;

export const COMMENTS_SUBSCRIPTION = gql`
 subscription OnCommentAdded($bookId: ID!) {
  commentAdded(bookId: $bookId) {
    text
  }
 }
`;
