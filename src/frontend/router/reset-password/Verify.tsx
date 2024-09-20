import {Form, useActionData, useSearchParams} from "react-router-dom";
import {DlFormPairInput} from "../../components/forms/DlFormPairInput";
import {VerifyActionData} from "./resetPasswordRoute";

export function Verify() {
    const [params] = useSearchParams();
    const actionData = useActionData() as VerifyActionData | undefined

    const email: string = params.get('email') ?? '';

    return <Form method="POST">
        <h2>Reset your password</h2>
        <p>An email has been sent to {email} with a verification code.</p>
        <p>Please enter the code and your new password.</p>

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
            <DlFormPairInput
                label="New Password"
                id="password"
                type="password"
                name="password"
                error={actionData?.error?.password}
            />
        </dl>

        <button type="submit" className="button primary">Reset password</button>
    </Form>
}
