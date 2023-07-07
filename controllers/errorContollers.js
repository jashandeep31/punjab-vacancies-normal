const sendErrorDev = (err, req, res) => {
    console.error("ERROR 💥", err, "this is something from render api");
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    sendErrorDev(err, req, res);
};
