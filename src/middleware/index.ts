import authenticate from "./authentication.middleware";
import authorization from "./authorization.middleware";
import errorMiddleware from "./error.middleware";
import validateRequest from "./validateRequest";
export const middleware = {
    authenticate,
    authorization,
    errorMiddleware,
    validateRequest
}