import {ActionFunction, NonIndexRouteObject, redirect} from "react-router-dom";
import {logout} from "../AuthClient";

const action: ActionFunction = async () => {
    console.log('logging out')
    try {
        await logout();
        return redirect('/')
    }
    catch (err) {
        console.log(err)
        return redirect('/')
    }
}

export const logoutRoute: NonIndexRouteObject = {
    path: 'logout',
    action,
}
