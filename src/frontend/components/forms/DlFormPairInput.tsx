import {HTMLProps} from "react";

export function DlFormPairInput({id, label, error, ...rest}: DlFormPairInputProps) {
    return <>
        <dt>
            <label htmlFor={id} className={error ? 'is-invalid-label' : undefined}>{label}</label>
        </dt>
        <dd>
            <input {...{...rest, id, className: `${rest.className ?? ''}${error ? ' is-invalid-input' : ''}`}} />
            {error &&
                <span className="form-error is-visible" role="alert">{error}</span>
            }
        </dd>
    </>
}

export type DlFormPairInputProps = HTMLProps<HTMLInputElement> & {
    id: string,
    label: string
    error?: string | undefined
}
