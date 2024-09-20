import {ActionFunction, NonIndexRouteObject, redirect} from "react-router-dom";
import {login, validateLoginRequest} from "../../AuthClient";
import {Login} from "./Login";
import {handleError} from "../../../util/error-helpers";

const action: ActionFunction = async ({request}) => {
    const formData = Object.fromEntries(await request.formData());

    try {
        const loginRequest = validateLoginRequest(formData);
        await login(loginRequest);
        return redirect('/')
    }
    catch (err) {
        return handleError(err)
    }
}

export const loginRoute: NonIndexRouteObject = {
    path: 'login',
    action: action,
    element: <Login/>
}
