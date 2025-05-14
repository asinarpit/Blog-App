import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';


export const PrivateRoute = () => {
    const { user } = useAuth();
    console.log(user?.token);

    return user?.token ? <Outlet /> : <Navigate to={"/login"} replace />

}