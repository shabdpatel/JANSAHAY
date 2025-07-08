// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const auth = getAuth(app);
    const location = useLocation();
    const user = auth.currentUser;

    if (!user?.email) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user is admin (email matches admin.department@domain.com)
    const isAdmin = /^admin\.[a-z]+@/i.test(user.email.toLowerCase());

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;