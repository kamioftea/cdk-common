export class JsonFetchException extends Error {
    constructor(readonly statusCode: number, readonly body?: unknown) {super(`FetchException: ${statusCode}`);}
}

export async function parseJsonResult<T>(response: Response): Promise<T> {
    const json = await response.json();
    if(json.statusCode && json.statusCode !== 200) {
        throw new JsonFetchException(parseInt(json.statusCode), json.body)
    }

    if(json.statusCode && json.body) {
        return json.body as T
    }

    return json as T;
}
