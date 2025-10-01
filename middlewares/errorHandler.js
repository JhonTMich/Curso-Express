const erorrHandler = (err, req, res, next) =>{
    const statusCode = error.statusCode || 500;
    const message = err.message || 'Error inesperado';

    console.error(`[ERROR] ${new Date().toISOString()} - ${statusCode} - ${message}`);

    if(err.stack){
        console.error(err.stack);
    }
    res.status(statusCode).json({
        status:'error',
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && {stack: err.stack})
    });
};

module.exports = erorrHandler;