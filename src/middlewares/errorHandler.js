export const errorHandler = async (err, req, res, next) => {
const status = err.status || 500;    
    res.status(status).json({   
            status,
            message: err.message,
            errors: err.errors || [],
    })

        
};