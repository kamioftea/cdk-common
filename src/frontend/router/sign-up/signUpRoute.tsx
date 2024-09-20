import {ActionFunction, NonIndexRouteObject, Outlet, redirect} from "react-router-dom";
import {SignUpPage, Verify} from "./SignUp";
import {signUp, validateSignUpRequest, validateVerificationRequest, verify} from "../../AuthClient";
import {handleError} from "../../../util/error-helpers";

const signUpAction: ActionFunction = async ({request}) => {
    try {
        const formData = Object.fromEntries(await request.formData());
        const signUpRequest = validateSignUpRequest(formData);

        await signUp(signUpRequest);
        return redirect(`./verify?email=${encodeURI(signUpRequest.email)}`)
    }
    catch (err) {
        return handleError(err);
    }
}

const verifyAction: ActionFunction = async ({request}) => {
    try {
        const formData = Object.fromEntries(await request.formData());
        const verificationRequest = validateVerificationRequest(formData);

        await verify(verificationRequest);

        return redirect('/')
    }
    catch (err) {
        return handleError(err)
    }
}

export const signUpRoute: NonIndexRouteObject = {
    path: 'signup',
    element: <Outlet/>,
    children: [
        {
            index: true,
            action: signUpAction,
            element: <SignUpPage/>,
        },
        {
            path: 'verify',
            action: verifyAction,
            element: <Verify/>
        }
    ]
}
