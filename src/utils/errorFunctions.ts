import { NextFunction, Request, Response } from "express";



export function errorHandlingMiddleware(error: any, req: Request, res: Response, next: NextFunction) {
    if (error.type === "error_not_found") return res.sendStatus(404).send(error.message);

    return res.sendStatus(500);
}

 export function notFoundError(entity: string) {
    return {
        type: "error_not_found",
        message: `Could not find specified "${entity}"!`
    };
}