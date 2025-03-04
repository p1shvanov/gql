import { FC, PropsWithChildren } from 'react';
import Cookie from 'js-cookie';
import {
    Drawer,
    AppBar,
    CssBaseline,
    Toolbar,
    List,
    Typography,
    ListItem,
    ListItemText,
    Button,
    Box,
    ListItemButton,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const contentDriver = [
    {
        name: 'Авторы',
        link: '/',
    },
    {
        name: 'Книги',
        link: '/books',
    },
];

const AppContainer: FC<PropsWithChildren<{}>> = ({ children }) => {
    const location = useLocation();

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}> {/* Ensures full height */}
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    display: 'flex',
                }}
            >
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                            React Advanced | GraphQL
                        </Link>
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={() => {
                            Cookie.remove('token');
                            window.location.reload();
                        }}
                    >
                        Выйти из аккаунта
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: 200,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 200,
                        backgroundColor: '#1565c0',
                        color: '#fff',
                    },
                }}
            >
                <Toolbar sx={(theme) => theme.mixins.toolbar} />
                <List>
                    {contentDriver.map((item) => (
                        <ListItem key={item.link} disablePadding>
                            <ListItemButton
                                component="div"
                                sx={{
                                    backgroundColor:
                                        location.pathname === item.link ? '#0d47a1' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: '#1976d2',
                                        color: '#ffffff',
                                    },
                                }}
                            >
                                <Link
                                    to={item.link}
                                    style={{
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        width: '100%',
                                        display: 'flex',
                                    }}
                                >
                                    <ListItemText primary={item.name} />
                                </Link>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{
                    display: 'flex',
                    flexDirection: 'column', // Set to column to stack items vertically
                    flexGrow: 1,
                    padding: (theme) => theme.spacing(3),
                    overflow: 'auto', // Optional: Ensures scroll if content overflows
                }}
            >
                <Toolbar sx={(theme) => theme.mixins.toolbar} />
                {children}
            </Box>
        </Box>
    );
};

export default AppContainer;
