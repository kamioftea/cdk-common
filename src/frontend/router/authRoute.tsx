import {type NonIndexRouteObject, Outlet} from "react-router-dom";
import {signUpRoute} from "./sign-up/signUpRoute";
import {loginRoute} from "./login/loginRoute";
import {logoutRoute} from "./logoutRoute";
import {resetPasswordRoute} from "./reset-password/resetPasswordRoute";

const Wrapper = () => <div className='auth-page'><Outlet /></div>

// noinspection JSUnusedGlobalSymbols external API
export const authRoute: NonIndexRouteObject = {
    path: 'auth',
    element: <Wrapper />,
    children: [
        signUpRoute,
        loginRoute,
        logoutRoute,
        resetPasswordRoute
    ]
}
