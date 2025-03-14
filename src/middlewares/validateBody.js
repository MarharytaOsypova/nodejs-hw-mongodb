import createError from "http-errors";
export const validateBody = (shema) => async (req, res, next) => {
try {
    await shema.validateAsync(req.body, {
        abortEarly: false,
    });
    next();
} catch (error) {
    const err = createError(400, 'Bad Request', {
      errors: error.details,
    });
    next(err); 
}
}