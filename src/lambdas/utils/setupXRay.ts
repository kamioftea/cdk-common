import * as AWSXRay from "aws-xray-sdk";

type Client = { middlewareStack: { remove: unknown, use: unknown }, config: unknown }

export function setupXRay(...clients: Client[]) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    AWSXRay.captureHTTPsGlobal(require("http"), true);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    AWSXRay.captureHTTPsGlobal(require("https"), true);
    AWSXRay.capturePromise();
    clients.forEach(c => AWSXRay.captureAWSv3Client(c))
}
