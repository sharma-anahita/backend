class ApiError extends Error {
    constructor(
        stackCode,
        errors = [],
        message = "Something went wrong",
        stack = ""
    ) {
        super(message);
        this.stackCode = stackCode;
        this.errors = erros;
        this.stack = stack;
        this.name = "ApiError";
        if (!stack) {
            this.stack = Error.captureStackTrace(this, constructor);
        }
    }
}

export { ApiError };
