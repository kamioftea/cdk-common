import {Link} from "react-router-dom";
import {FiAlertTriangle, FiChevronLeft} from "react-icons/fi";
import {JsonFetchException} from "../../util/fetch-helpers";

export interface RenderErrorMessageProps {
    title: string,
    response: JsonFetchException
}

function fudgeErrorMessage(error: unknown) :string {
    if(typeof error === 'string') {
        return error;
    }

    if(error && typeof error === 'object' && 'error' in error && error.error) {
        return error.error.toString()
    }

    return 'Unexpected error occurred';
}

export const RenderErrorMessage = ({title, response}: RenderErrorMessageProps) =>
    <>
        <p><Link to={'/'}><FiChevronLeft/> Back</Link></p>
        <div className="callout alert">
            <h2><FiAlertTriangle/> {title}</h2>
            <p>{fudgeErrorMessage(response.body)}</p>
        </div>
    </>;
