import { useQuery } from '@apollo/client';
import { Box, Typography, CircularProgress } from '@mui/material';
import { TableComponent } from '../../components';

import { GET_ALL_BOOKS } from './graphql';
import { getAllBooks } from './__generated__/getAllBooks';

const headerContent = ['Название книги', 'Автор', 'Ссылка']

const BooksContainer = () => {
    const { loading, error, data } = useQuery<getAllBooks>(GET_ALL_BOOKS);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress /> {/* Загрузка спиннера */}
                <Typography sx={{ ml: 2 }}>Loading...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography color="error">Error: {error.message}</Typography>
            </Box>
        );
    }

    const content = data
        ? data.allBooks.map((book) => ({
            id: book.id,
            title: book.title,
            authors: `${book.author.firstname} ${book.author.lastname}`,
            link: `/books/${book.id}`,
        }))
        : [];

    return (
        <Box sx={{ p: 2 }}>
            <TableComponent headerContent={headerContent} title="Список книг" rows={content} />
        </Box>
    );
};

export default BooksContainer;