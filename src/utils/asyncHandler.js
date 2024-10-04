const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }

}

export default asyncHandler;

// const asyncHandler = (funcation) => async (req, res, next) => {
//     try {
//         await funcation(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             sucess: false,
//             message: err.message
//         })
//     }
// }