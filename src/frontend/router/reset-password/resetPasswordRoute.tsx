import {ActionFunction, NonIndexRouteObject, Outlet, redirect} from "react-router-dom";
import {
    forgotPassword,
    ForgotPasswordError,
    resetPassword,
    ResetPasswordError,
    validateForgotPasswordRequest,
    validateResetPasswordRequest,
} from "../../AuthClient";
import {handleError} from "../../../util/error-helpers";
import {ResetPassword} from "./ResetPassword";
import {Verify} from "./Verify";

export interface ForgotPasswordActionData {
    error?: ForgotPasswordError
}

const action: ActionFunction<ForgotPasswordActionData> = async ({request}) => {
    try {
        const formData = Object.fromEntries(await request.formData());
        const forgotPasswordRequest = validateForgotPasswordRequest(formData);

        await forgotPassword(forgotPasswordRequest);
        return redirect(`./verify?email=${encodeURI(forgotPasswordRequest.email)}`)
    }
    catch (err) {
        return handleError(err)
    }
}

export interface VerifyActionData {
    error?: ResetPasswordError
}

const verifyAction: ActionFunction<VerifyActionData> = async ({request}) => {
    try {
        const formData = Object.fromEntries(await request.formData());
        const resetPasswordRequest = validateResetPasswordRequest(formData);

        await resetPassword(resetPasswordRequest);

        return redirect('/')
    }
    catch (err) {
        return handleError(err)
    }
}

export const resetPasswordRoute: NonIndexRouteObject = {
    path: 'reset-password',
    element: <Outlet/>,
    children: [
        {
            index: true,
            action: action,
            element: <ResetPassword/>,
        },
        {
            path: 'verify',
            action: verifyAction,
            element: <Verify/>
        }
    ]
}
