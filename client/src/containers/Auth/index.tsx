import { FC, useCallback, useEffect, useState } from 'react';
import { TextField, Button, Box } from '@mui/material'; // Updated to MUI v5
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie'; // Correctly import js-cookie
import { LOGIN } from './graphql';
import ErrorComponent from '../../components/Error';

const AuthComponent: FC = () => {
    const [email, setEmail] = useState('');
    const [login, { data, error }] = useMutation(LOGIN);

    // Обработаем логику входа в систему
    const onLogin = useCallback(async () => {
        try {
            await login({ variables: { email } });
        } catch (error) {
            console.error('Login error:', error);
        }
    }, [email, login]);

    // Установим токен и перенаправим после успешного входа в систему
    useEffect(() => {
        if (data) {
            const { login: token } = data;
            Cookies.set('token', token); // Установим токен в cookies
            window.location.href = '/'; // Перенаправим на главную страницу после успешного входа
        }
    }, [data]);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100vw',
                height: '100vh',
                backgroundColor: '#29b6f6',
            }}
        >
            <Box
                sx={{
                    backgroundColor: '#fff',
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: 300,
                    padding: '20px',
                    boxShadow: 3,
                }}
            >
                <TextField
                    id="name"
                    label="Ваше Имя"
                    onChange={(e) => setEmail(e.target.value.trim())}
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" color="secondary" onClick={onLogin} sx={{ mt: 2 }}>
                    Войти
                </Button>
                {error && <ErrorComponent error={error} />}
            </Box>
        </Box>
    );
};

export default AuthComponent;