import {AttributeType, GetUserCommand,} from "@aws-sdk/client-cognito-identity-provider";
import {Route} from "./route";
import {getAccessToken} from "../utils/tokenUtils";
import {Schema, z} from "zod";
import {handleError} from "../utils/errorResponse";

interface GetUserResponse {
    name: string,
    email: string,
}

function validateGetUserResponse(input: unknown): GetUserResponse {
    const schema: Schema<GetUserResponse> = z.object(
        {
            name: z.string(),
            email: z.string(),
        }
    ).strict();

    return schema.parse(input);
}

const handler: Route<GetUserResponse>["handler"] =
    async (event, {client}) => {
        try {
            const accessToken = getAccessToken(event);

            const res = await client.send(
                new GetUserCommand({AccessToken: accessToken})
            );

            const attributesToEntries = ({Name, Value}: AttributeType) => Name && Value ? [[Name, Value]] : [];
            const attributes = Object.fromEntries((res.UserAttributes ?? []).flatMap(attributesToEntries))

            return validateGetUserResponse({
                                               name: attributes.nickname,
                                               email: attributes.email
                                           });
        }
        catch (err: unknown) {
            return handleError(err)
        }
    }

export const getUserRoute: Route<GetUserResponse> = {
    handler,
    method: "GET",
    action: "/",
}
