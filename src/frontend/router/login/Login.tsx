import {Form, Link, useActionData} from "react-router-dom";
import {FetchException, LoginError} from "../../AuthClient";
import {DlFormPairInput} from "../../components/forms/DlFormPairInput";
import {FiInfo} from "react-icons/fi";

export function Login() {
    const actionData = useActionData() as FetchException<LoginError>;

    return <>
        <Form method="POST">
            <h2>Login</h2>
            <p className="lead">You need to log in to join the crusade and manage your roster</p>
            {actionData?.error?.global &&
                <div className="callout alert form-width">{actionData?.error?.global}</div>
            }
            <dl className="dl-horizontal">
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
            <button type="submit" className="button primary">Login</button>
        </Form>
        <p>Don't have an account? <Link to={'/auth/sign-up'}>Sign up here.</Link></p>
        <p>Forgotten your password? <Link to={'/auth/reset-password'}>Request a password reset.</Link></p>
        <aside className="callout primary smaller form-width">
            <h3 className='text-primary h5'><FiInfo className="icon"/> Cookies</h3>
            <p>
                Crusade manager only stores cookies essential to the working of the site.
            </p>
            <p>
                To log you in, a cookie will be stored to record your identity. It will only be used when requesting
                and storing decks to verify you have permission to do so.
            </p>
        </aside>
    </>
}
