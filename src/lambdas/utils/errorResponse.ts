import {APIGatewayProxyResult} from "aws-lambda/trigger/api-gateway-proxy";

export class ErrorResponse extends Error {
    constructor(readonly statusCode: number, readonly body: unknown, readonly headers?: { [key: string]: string }) {
        super(`Error response: status ${statusCode}`);
    }

    asResponse(): APIGatewayProxyResult {
        return {
            // Errors are swallowed by cloud front or the redirect when S3 fails doesn't work
            statusCode: 200,
            headers: {
                ...(this.headers ?? {}),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    body: this.body,
                    statusCode: this.statusCode,
                }
            )
        }
    }
}

export function handleError(err: unknown): APIGatewayProxyResult {
    if (err instanceof ErrorResponse) {
        console.log('returning', err.asResponse())
        return err.asResponse()
    }
    console.error(err);
    // Errors are swallowed by cloud front or the redirect when S3 fails doesn't work
    return {
        statusCode: 200,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
            {
                error: guessMessage(err),
                statusCode: 500
            }
        )
    }
}

export function guessMessage(err: unknown): string {
    if (err instanceof Error) {
        return err.message;
    } else if (typeof err === 'string') {
        return err;
    } else {
        return 'Unknown error';
    }
}
