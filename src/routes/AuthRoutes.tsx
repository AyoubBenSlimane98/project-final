import { Navigate, Route } from 'react-router'
import SignUP from '../pages/auth/SignUP'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetEmail from '../pages/auth/ResetEmail'
import SignIN from '../pages/auth/SignIN'

const AuthRoutes = (
    <>
        <Route path="/" element={<Navigate to="/sign-in" />} />
        <Route index path="/sign-in" element={<SignIN />}  />
        <Route path="/sign-up" element={<SignUP />} />
        <Route path="/password">
            <Route index element={<ForgotPassword />} />
            <Route path="reset-email" element={<ResetEmail />} />
        </Route>
    </>
)

export default AuthRoutes;