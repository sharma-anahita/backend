class ApiError extends Error {
    constructor(
        statusCode,
        errors = [],
        message = "Something went wrong",
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errors = erros;
        this.stack = stack;
        this.name = "ApiError";
        if (!stack) {
            this.stack = Error.captureStackTrace(this, constructor);
        }
    }
}

export { ApiError };
