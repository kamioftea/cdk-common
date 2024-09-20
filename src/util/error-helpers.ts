import {ZodError} from "zod";
import {FetchException} from "../frontend/AuthClient";

export function handleError(err: unknown) {
    if (err instanceof ZodError) {
        return {error: Object.fromEntries(err.errors.map(issue => [issue.path.join('.'), issue.message]))}
    }
    if (err instanceof FetchException) {
        return {error: err.error}
    }
    return {error: {global: `Something went wrong: ${(err as Error).message}`}, err}
}
