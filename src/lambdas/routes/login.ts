import {InitiateAuthCommand, NotAuthorizedException,} from "@aws-sdk/client-cognito-identity-provider";
import {parseBody, Route} from "./route";
import {Schema, z} from "zod";
import {COOKIE_PATH} from "../utils/tokenUtils";
import {guessMessage} from "../utils/errorResponse";

interface LoginRequest {
    email: string,
    password: string,
}

function validateLoginRequest(input: unknown): LoginRequest {
    const schema: Schema<LoginRequest> = z.object(
        {
            email: z.string().email(),
            password: z.string().min(12)
        }
    )
    return schema.parse(input);
}

export const handler: Route["handler"] =
    async (event, {client, clientId, segment}) => {
        try {
            const {email, password} = parseBody(event, validateLoginRequest);

            const response = await client.send(
                new InitiateAuthCommand(
                    {
                        ClientId: clientId,
                        AuthFlow: 'USER_PASSWORD_AUTH',
                        AuthParameters: {
                            USERNAME: email,
                            PASSWORD: password
                        }
                    }
                )
            );

            return {
                statusCode: 200,
                cookies:[
                    `auth=${response.AuthenticationResult?.AccessToken}; HttpOnly; SameSite=Strict; Path=${COOKIE_PATH}; Max-Age=${response.AuthenticationResult?.ExpiresIn}`,
                ],
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email}),
            }
        }
        catch (err: unknown) {
            segment?.addError(JSON.stringify(err));

            let statusCode = 500;
            let message = guessMessage(err);

            if(err instanceof NotAuthorizedException) {
                statusCode = 401;
                message = 'Invalid email or password'
            }

            // Clear auth cookie on error
            return {
                statusCode,
                cookies: [`auth=; HttpOnly; Path=${COOKIE_PATH}; Max-Age=0; SameSite=Strict`],
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({error: {global: message}}),
            }
        }
    }

    export const loginRoute: Route = {
        handler,
        method: 'POST',
        action: 'login'
    }
