// Accepts one function and also return the same function by wrapping it with async await and try catch
const AsyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        next(error);
    }
}

export { AsyncHandler }