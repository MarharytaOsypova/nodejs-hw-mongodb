import createError from "http-errors";
export const validateBody = (shema) => async (req, res, next) => {
try {
    await shema.validateAsync(req.body, {
        abortEarly: false,
    });
    next();
} catch (error) {
    const errorMessages = error.details.map((detail) => ({
        message: detail.message,
        path: detail.path,
        type: detail.type,
    }));
const err = createError(400, "Bad request", { errors: errorMessages });
    next(err); 
}
}