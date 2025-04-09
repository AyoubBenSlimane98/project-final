import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "../store";
import { useTokenRefresher } from "../hooks/useTokenRefresher";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const accessToken = useAuthStore((state) => state.accessToken);
    const location = useLocation();
    useTokenRefresher();
    return accessToken ? (
        children
    ) : (
        <Navigate to="/sign-in" state={{ from: location }} replace />
    );
};

export default PrivateRoute;