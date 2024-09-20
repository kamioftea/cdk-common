import {Form, Link, useActionData} from "react-router-dom";
import {DlFormPairInput} from "../../components/forms/DlFormPairInput";
import {ForgotPasswordActionData} from "./resetPasswordRoute";

export function ResetPassword() {
    const actionData = useActionData() as ForgotPasswordActionData | undefined

    return <>
        <Form method="POST">
            <h2>Forgot password</h2>
            {actionData?.error?.global &&
                <div className="callout alert">{actionData?.error?.global}</div>
            }
            <dl className="dl-horizontal">
                <DlFormPairInput
                    label="Email"
                    id="email"
                    type="text"
                    name="email"
                    error={actionData?.error?.email}
                />
            </dl>
            <button type="submit" className="button primary">Send password reset code</button>
        </Form>
        <p>Remembered your password? <Link to={'/auth/login'}>Login here.</Link></p>
    </>
}
