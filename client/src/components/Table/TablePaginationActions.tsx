import React, { FC } from 'react';
import { IconButton, Box } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useTheme } from '@mui/material/styles';

interface TablePaginationActionsProps {
    onChangePage: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
    page: number;
    rowsPerPage: number;
    count: number;
}

const TablePaginationActions: FC<TablePaginationActionsProps> = ({
                                                                     page,
                                                                     onChangePage,
                                                                     count,
                                                                     rowsPerPage,
                                                                 }) => {
    const theme = useTheme(); // Access the theme directly using the useTheme hook

    return (
        <Box
            sx={{
                flexShrink: 0,
                color: theme.palette.text.secondary,
                ml: 2.5,
            }}
        >
            <IconButton
                onClick={(event) => onChangePage(event, page - 1)}
                disabled={page === 0}
                aria-label="Предыдущая страница"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={(event) => onChangePage(event, page + 1)}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="Следующая страница"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
        </Box>
    );
};

export default TablePaginationActions;