const asyncHandler = (requestHandler) => {
    return (req, res, next) => {  // Returns middleware function
        Promise.resolve(requestHandler(req, res, next))  // Converts handler to Promise
        .catch((err) => next(err))  // Passes any errors to Express error handler
    }
}


export default asyncHandler;