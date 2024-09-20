import {Form, Link, useActionData, useSearchParams} from "react-router-dom";
import {SignUpError, VerificationRequestError} from "../../AuthClient";
import {DlFormPairInput} from "../../components/forms/DlFormPairInput";

interface ActionData {
    error?: SignUpError
}

export function SignUpPage() {
    const actionData = useActionData() as ActionData | undefined

    return <>
        <Form method="POST">
            <h2>Sign up</h2>
            {actionData?.error?.global &&
                <div className="callout alert">{actionData?.error?.global}</div>
            }
            <dl className="dl-horizontal">
                <DlFormPairInput
                    label="Name"
                    id="name"
                    type="text"
                    name="name"
                    error={actionData?.error?.name}
                />
                <DlFormPairInput
                    label="Email"
                    id="email"
                    type="text"
                    name="email"
                    error={actionData?.error?.email}
                />
                <DlFormPairInput
                    label="Password"
                    id="password"
                    type="password"
                    name="password"
                    error={actionData?.error?.password}
                />
            </dl>
            <button type="submit" className="button primary">Sign Up</button>
        </Form>
        <p>Already have an account? <Link to={'/auth/login'}>Login here.</Link></p>
    </>
}

interface VerifyActionData {
    error?: VerificationRequestError
}

export function Verify() {
    const [params] = useSearchParams();
    const actionData = useActionData() as VerifyActionData | undefined

    const email: string = params.get('email') ?? '';

    return <Form method="POST">
        <h2>Verify you email</h2>
        <p>An email has been sent to {email} with a code to verify your account.</p>

        <dl className="dl-horizontal">
            <DlFormPairInput
                label="Email"
                id="email"
                type="text"
                defaultValue={email}
                name="email"
                error={actionData?.error?.email}
            />
            <DlFormPairInput
                label="Verification code"
                id="verification_code"
                type="text"
                name="verification_code"
                error={actionData?.error?.verification_code}
            />
        </dl>

        <button type="submit" className="button primary">Verify account</button>
    </Form>
}

