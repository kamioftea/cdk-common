import {FiAlertTriangle} from "react-icons/fi";

export function ErrorBanner({error}: { error: Error }) {
    return <div className={"callout alert"}>
        <FiAlertTriangle/> {error.message}
    </div>;
}
