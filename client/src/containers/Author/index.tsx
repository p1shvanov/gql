import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { Paper, Grid2, Typography, Box } from '@mui/material';
import { useQuery } from '@apollo/client';
import { format } from 'date-fns';
import { isNil } from 'lodash';

import { TableComponent } from '../../components';
import ErrorComponent from '../../components/Error';

import { GET_AUTHOR_BY_ID } from './graphql';
import { getAuthor } from './__generated__/getAuthor';

interface AuthorProps {
  authorId: number;
}

const Author: FC<AuthorProps> = ({ authorId }) => {
  const { data, error, loading } = useQuery<getAuthor>(GET_AUTHOR_BY_ID, {
    variables: { id: authorId },
  });

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <ErrorComponent error={error} />;

  const author = data?.getAuthor;

  return (
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Paper sx={{ p: 2, m: 'auto' }}>
          <Grid2 container sx={{ gap: 2 }}>
            <Grid2
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gridColumn: {
                    xs: 'span 12',
                    sm: 'span 6',
                  },
                }}
            >
              <Grid2 sx={{ flex: 1 }}>
                <Typography gutterBottom variant="subtitle1">
                  {author?.lastname} {author?.firstname}
                </Typography>
                <Typography gutterBottom>{author?.bio}</Typography>
              </Grid2>
              <Grid2>
                <NavLink to="/">
                  <Typography sx={{ cursor: 'pointer' }}>Назад</Typography>
                </NavLink>
              </Grid2>
            </Grid2>
          </Grid2>
        </Paper>
        <Paper sx={{ p: 4, m: 'auto', mt: 2 }}>
          {!isNil(author) && !isNil(author.books) && (
              <TableComponent
                  headerContent={['Дата публикации', 'Заголовок']}
                  title="Список книг автора"
                  rows={author.books.map(({ pubDate, title, id }) => ({
                    pubDate: format(new Date(pubDate), 'MM.dd.yyyy'),
                    title,
                    id,
                  }))}
              />
          )}
        </Paper>
      </Box>
  );
};

export default Author;