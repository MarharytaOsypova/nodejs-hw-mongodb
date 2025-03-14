import createError from "http-errors";
import { isValidObjectId } from "mongoose";

export const isValidId = (req, res, next) => {
    const { contactId } = req.params;
    if (!isValidObjectId(contactId)) {
        throw createError(400, 'Bad Request');
    }
    next();
}