import {Routes, Route, Navigate, Outlet, useParams} from 'react-router-dom';
import Cookies from 'js-cookie';

import { AuthPage, AuthorsPage, BooksPage, AuthorPage, BookPage }
    from './pages/index.tsx';

// PrivateRoute implementation using Outlet
function PrivateRoute() {
    const isAuthenticated = Cookies.get('token');

    if (!isAuthenticated) {
        // Redirect unauthenticated users to the auth page
        return <Navigate to="/auth" replace />;
    }

    // If authenticated, render the nested routes
    return <Outlet />;
}

export default (
    <Routes>
        {/* Public route */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Private routes wrapper */}
        <Route element={<PrivateRoute />}>
            {/* Nested private routes */}
            <Route path="/" element={<AuthorsPage />} />
            <Route
                path="/authors/:authorId"
                element={<AuthorWrapper />}
            />
            <Route path="/books" element={<BooksPage />} />
            <Route
                path="/books/:bookId"
                element={<BookWrapper />}
            />
        </Route>
    </Routes>
);

// Separate components to handle route parameters using useParams
function AuthorWrapper() {
    const { authorId } = useParams<{ authorId: string }>();
    return <AuthorPage authorId={Number(authorId)} />;
}

function BookWrapper() {
    const { bookId } = useParams<{ bookId: string }>();
    return <BookPage bookId={Number(bookId)} />;
}