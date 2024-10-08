class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something Went Wrong",
        errors = [],
        statck = ""
    ) {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.sucess = false
        this.errors = errors

        if (statck ) {
            this.stack = statck
        } else {
            Error.captureStatckTrace(this, this.constructor)
        }
    }
}

export {ApiError}