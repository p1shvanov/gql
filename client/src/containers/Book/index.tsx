import { FC, useState } from 'react';
import {useQuery, useMutation} from '@apollo/client';
import {Paper, Button, Box, Typography, TextField} from '@mui/material';
import { Link } from 'react-router-dom';
import { isNil } from 'lodash';

import { BookCardComponent } from '../../components';
import {GET_BOOK_BY_ID, ADD_COMMENT_TO_BOOK} from './graphql';
import {getBook, getBook_getBook_comments} from './__generated__/getBook';

interface BookComponentProps {
  bookId: number;
}

const BookComponent: FC<BookComponentProps> = ({ bookId }) => {
  const [commentPerPage] = useState(5);
  const [pageNumber, setPageNumber] = useState(0);
  const [newCommentText, setNewCommentText] = useState(''); // State for new comment text
  const [newCommentAuthor, setNewCommentAuthor] = useState(''); // State for new comment author

  const { data, error } = useQuery<getBook>(GET_BOOK_BY_ID, {
    variables: { id: bookId },
  });

  const [addComment] = useMutation(ADD_COMMENT_TO_BOOK, {
    onCompleted: () => {
      setNewCommentText(''); // Clear the comment text input
      setNewCommentAuthor(''); // Clear the author input
    },
    update(cache, { data }) {
      if (!data || !data.addComment) return;

      // Извлечем новый комментарий из ответа на мутацию.
      const newComment: getBook_getBook_comments = data.addComment;

      // Прочитаем существующие данные книги из кэша с явным указанием типа.
      const existingBook = cache.readQuery<getBook>({
        query: GET_BOOK_BY_ID,
        variables: { id: bookId },
      });

      if (existingBook && existingBook.getBook) {
        // Извлечем существующие комментарии из книги
        const existingComments = existingBook.getBook.comments ?? [];

        // Проверим на дубликаты и добавим новый комментарий
        const updatedComments: (getBook_getBook_comments | null)[] = [
          ...existingComments.filter((comment) => comment?.id !== newComment.id),
          newComment,
        ];

        // Запишем обновленный список комментариев обратно в кэш.
        cache.writeQuery<getBook>({
          query: GET_BOOK_BY_ID,
          data: {
            getBook: {
              ...existingBook.getBook,
              comments: updatedComments,
            },
          },
          variables: { id: bookId },
        });
      }
    },
  });

  if (error) return <Typography color="error">Error: {error.message}</Typography>;
  if (isNil(data?.getBook)) return <Typography>Loading...</Typography>;
  if (!data?.getBook) return <Typography>No such Book!</Typography>;

  const comments = data.getBook.comments ?? [];
  const totalComments = comments.length;

  // Рассчитаем начальные и конечные индексы для текущей страницы
  const startIndex = pageNumber * commentPerPage;
  const endIndex = startIndex + commentPerPage;

    // Получим комментарии для отображения на текущей странице
  const currentComments = comments.slice(startIndex, endIndex);

  const setNextPage = () => {
    if (endIndex < totalComments) {
      setPageNumber(pageNumber + 1);
    }
  };

  const setPreviousPage = () => {
    if (pageNumber > 0) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleAddComment = () => {
    if (newCommentText.trim() && newCommentAuthor.trim()) {
      addComment({
        variables: {
          comment: {
            bookId: bookId,
            author: newCommentAuthor,
            text: newCommentText,
          },
        },
      });
    }
  };

  const book = data.getBook;

  return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <BookCardComponent
              title={book.title}
              description={book.description}
              author={book.author}
              date={book.pubDate}
          />
          <Typography>Количество комментариев: {totalComments}</Typography>
          {currentComments.length > 0 ? (
              <Paper sx={{ p: 2, mt: 2 }}>
                <Typography variant="h6">Комментарии</Typography>
                <Box sx={{ mt: 1 }}>
                  {currentComments.map(
                      (comment, index) =>
                          comment && (
                              <Typography key={index}>
                                <strong>{comment.author}</strong>: {comment.text}
                              </Typography>
                          )
                  )}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button onClick={setPreviousPage} variant="outlined" disabled={pageNumber === 0}>
                    Предыдущий
                  </Button>
                  <Button
                      onClick={setNextPage}
                      variant="outlined"
                      disabled={endIndex >= totalComments}
                  >
                    Следующий
                  </Button>
                </Box>
              </Paper>
          ) : (
              <Typography>Нет доступных комментариев.</Typography>
          )}
          {/* Add Comment Section */}
          <Box sx={{ mt: 2 }}>
            <TextField
                label="Автор"
                value={newCommentAuthor}
                onChange={(e) => setNewCommentAuthor(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
            />
            <TextField
                label="Добавить комментарий"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                sx={{ mb: 2 }}
            />
            <Button onClick={handleAddComment} variant="contained" color="primary">
              Отправить комментарий
            </Button>
          </Box>
        </Box>
        <Button variant="contained" component={Link} to="/books" color="secondary" sx={{ mt: 2 }}>
          Назад
        </Button>
      </Paper>
  );
};

export default BookComponent;
