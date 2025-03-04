import { FC, useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { Button, Card, CardContent, Box, Typography } from '@mui/material';
import { isNil } from 'lodash';
import { TableComponent } from '../../components';
import ErrorComponent from '../../components/Error';

import { AUTHOR_ADDED, GET_AUTHOR_LIST } from './graphql';
import { getAllAuthors } from './__generated__/getAllAuthors';
import AddAuthorForm from './AddAuthorForm';

const headerContent = ['Имя', 'Фамилия', 'Количество книг', 'Ссылка']

const NewAuthor: FC<{ onNewAuthor: () => void }> = ({ onNewAuthor }) => {
    console.log('starting subscription')
    const { data } = useSubscription(AUTHOR_ADDED, {
        onData: () => console.log('new author added')
    });

    if (!data) return null;
    onNewAuthor();

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography>
                    Новый автор добавлен: {data.authorAdded.firstname} {data.authorAdded.lastname}
                </Typography>
            </CardContent>
        </Card>
    );
};

const AuthorsContainer: FC = () => {
    const { data, loading, error, refetch } =
        useQuery<getAllAuthors>(GET_AUTHOR_LIST);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <ErrorComponent error={error} />;

    const content = !isNil(data)
        ? data.allAuthors.map(({ firstname, lastname, books, id }) => ({
            id,
            firstname,
            lastname,
            count: books?.length || 0,
            link: `/authors/${id}`,
        }))
        : [];

    return (
        <Box>
            <NewAuthor onNewAuthor={refetch} />

            <TableComponent
                headerContent={headerContent}
                title={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Список авторов</Typography>
                        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                            Добавить автора
                        </Button>
                    </Box>
                }
                rows={content}
            />

            {open && <AddAuthorForm open={open} handleClose={handleClose} onSuccess={refetch} />}
        </Box>
    );
};

export default AuthorsContainer;