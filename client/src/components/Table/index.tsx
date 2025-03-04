import React, { ReactNode, useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
  TablePagination,
  IconButton,
  Box,
  Typography,
} from '@mui/material'; // Updated MUI imports
import OpenInNew from '@mui/icons-material/OpenInNew'; // Updated icon import
import { Link } from 'react-router-dom';

// Определите обобщенный тип для строк, расширяющий известные свойства и позволяющий динамические ключи.
type Row<T = {}> = T & {
  id: string | number;
  link?: string; // Явно определите link, если это ожидается, в противном случае определите его динамически в строках.
};

interface TableComponentProps<T> {
  rows?: Row<T>[]; // Сделайте строки необязательными и обеспечьте обработку для undefined
  headerContent: string[];
  title: string | ReactNode;
}

const TableComponent = <T extends object>({
                                            rows = [], // Установите строки по умолчанию в пустой массив, чтобы избежать несовпадения типов.
                                            headerContent = ['Column 1', 'Column 2', 'Column 3'],
                                            title = 'Заголовок',
                                          }: TableComponentProps<T>) => {
  // Use memoized rows, falling back to defaultRows if rows are empty
  const effectiveRows = useMemo(() => (rows.length ? rows : [{ id: 1 }]), [rows]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Paper sx={{ width: '100%', overflowX: 'auto', mt: 3 }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                {headerContent.map((item) => (
                    <TableCell key={item}>{item}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {effectiveRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                      <TableRow key={row.id}>
                        {Object.entries(row).map(([key, value]) => {
                          if (key !== 'id') {
                            return (
                                <TableCell key={key}>
                                  {key === 'link' && typeof value === 'string' ? (
                                      <IconButton component={Link} to={value}>
                                        <OpenInNew />
                                      </IconButton>
                                  ) : (
                                      value
                                  )}
                                </TableCell>
                            );
                          }
                          return null;
                        })}
                      </TableRow>
                  ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                    rowsPerPageOptions={[2, 3, 5]}
                    count={effectiveRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Строк на странице:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>
      </Box>
  );
};

export default TableComponent;