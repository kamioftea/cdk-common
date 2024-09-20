// noinspection JSUnusedGlobalSymbols - Exported as part of the public API

import {Schema, z} from 'zod';
import {parseJsonResult} from "../util/fetch-helpers";

export class FetchException<T extends { global?: string }> extends Error {
    constructor(readonly statusCode: number, readonly error: T) {
        super(`Sign up failed: ${statusCode} - ${error.global ?? 'Something was wrong'}`);
    }
}

export interface SignUpRequest {
    name: string,
    email: string,
    password: string
}

export interface SignUpResponse {
    name: string,
    email: string,
}

export type SignUpError = {
    global?: string,
    name?: string,
    email?: string,
    password?: string,
};

export interface User {
    name: string,
    email: string,
}

let user: User | undefined | null = undefined;

export function validateSignUpRequest(input: unknown): SignUpRequest {
    const schema: Schema<SignUpRequest> = z.object(
        {
            name: z.string(),
            email: z.string().email(),
            password: z.string().min(12, 'Password must be at least 12 characters')
        }
    ).strict();

    return schema.parse(input);
}

export async function signUp(request: SignUpRequest): Promise<SignUpResponse> {
    return await fetch(
        '/api/auth/sign-up',
        {
            method: 'POST',
            body: JSON.stringify(request)
        }
    ).then(async (res) => {
        return {status: res.status, json: await res.json()}
    }).then(({status, json}) => {
        if (status !== 200) {
            throw new FetchException<SignUpError>(status, json.error)
        }

        return json as SignUpResponse
    })
}

export interface VerificationRequest {
    email: string,
    verification_code: string
}

export interface VerificationRequestError {
    global?: string,
    email?: string,
    verification_code?: string
}

export interface VerificationResponse {
    email: string,
}

export function validateVerificationRequest(input: unknown): VerificationRequest {
    const schema: Schema<VerificationRequest> = z.object(
        {
            email: z.string().email(),
            verification_code: z.string(),
        }
    ).strict();

    return schema.parse(input);
}

export async function verify(request: VerificationRequest): Promise<VerificationResponse> {
    return await fetch(
        '/api/auth/verify',
        {
            method: 'POST',
            body: JSON.stringify(request)
        }
    ).then(async (res) => {
        return {status: res.status, json: await res.json()}
    }).then(({status, json}) => {
        if (status !== 200) {
            throw new FetchException<VerificationRequestError>(status, json.error)
        }

        return json as VerificationResponse
    })
}

export interface LoginRequest {
    email: string,
    password: string,
}

export interface LoginResponse {
    email: string,
    id_token: string,
    access_token: string,
    refresh_token: string,
}

export type LoginError = {
    global?: string,
    email?: string,
    password?: string,
};

export function validateLoginRequest(input: unknown): LoginRequest {
    const schema: Schema<LoginRequest> = z.object(
        {
            email: z.string().email(),
            password: z.string().min(12)
        }
    )
    return schema.parse(input);
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
    return await fetch(
        '/api/auth/login',
        {
            method: 'POST',
            body: JSON.stringify(request)
        }
    ).then(async (res) => {
        return {status: res.status, json: await res.json()}
    }).then(({status, json}) => {
        if (status !== 200) {
            throw new FetchException<LoginError>(status, json.error)
        }

        user = undefined;

        return json as LoginResponse
    })
}

export async function getUser(): Promise<User | null> {
    if (user !== undefined) {
        return user;
    }

    return await fetch('/api/auth')
        .then(parseJsonResult<User>)
        .catch(err => {
            if (err instanceof FetchException && err.statusCode === 401) {
                user = null;
                return null;
            }
            throw err;
        })
}

export async function logout(): Promise<void> {
    try {
        await fetch('/api/auth/logout', {method: 'POST'})
    } catch (err) {
        console.log(err)
    }
    user = null;
}

export interface ForgotPasswordRequest {
    email: string
}

export interface ForgotPasswordError {
    global?: string
    email?: string
}

export function validateForgotPasswordRequest(input: unknown): ForgotPasswordRequest {
    const schema: Schema<ForgotPasswordRequest> = z.object(
        {
            email: z.string().email(),
        }
    )
    return schema.parse(input);
}

export async function forgotPassword(request: ForgotPasswordRequest): Promise<void> {
    await fetch('/api/auth/forgot-password', {method: 'POST', body: JSON.stringify(request)})
}

export interface ResetPasswordRequest {
    email: string,
    verification_code: string,
    password: string,
}

export interface ResetPasswordError {
    global?: string
    email?: string
    verification_code?: string,
    password?: string,
}

export function validateResetPasswordRequest(input: unknown): ResetPasswordRequest {
    const schema: Schema<ResetPasswordRequest> = z.object(
        {
            email: z.string().email(),
            verification_code: z.string(),
            password: z.string().min(12)
        }
    )
    return schema.parse(input);
}

export async function resetPassword(request: ResetPasswordRequest): Promise<void> {
    await fetch('/api/auth/reset-password', {method: 'POST', body: JSON.stringify(request)})
}
