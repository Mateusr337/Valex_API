export function errorHandlingMiddleware(error, req, res, next) {
    if (error.type === "error_not_found")
        return res.status(404).send(error.message);
    if (error.type === "bad_request")
        return res.status(422).send(error.message);
    if (error.type === "unauthorized")
        return res.status(401).send(error.message);
    console.log(error.message);
    return res.sendStatus(500);
}
export function notFoundError(entity) {
    return {
        type: "error_not_found",
        message: "Could not find specified \"".concat(entity, "\"!")
    };
}
export function badRequestError(entity) {
    return {
        type: "bad_request",
        message: "Request data error: \"".concat(entity, "\"!")
    };
}
export function unauthorizedError(entity) {
    return {
        type: "unauthorized",
        message: "Unauthorized \"".concat(entity, "\"!")
    };
}
