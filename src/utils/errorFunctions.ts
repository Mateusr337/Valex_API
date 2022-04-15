import { NextFunction, Request, Response } from "express";



export function errorHandlingMiddleware (error: any, req: Request, res: Response, next: NextFunction) {
    console.log('error');
    if (error.type === "error_not_found") return res.status(404).send(error.message);
    if (error.type === "bad_request") return res.status(422).send(error.message);

    return res.sendStatus(500);
}

export function notFoundError (entity: string) {
    return {
        type: "error_not_found",
        message: `Could not find specified "${entity}"!`
    };
}

export function badRequestError (entity: string) {
    return {
        type: "bad_request",
        message: `Request data error: "${entity}"!`
    };
}