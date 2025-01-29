// wrapper function to wrap the function with try catch block
export const wrapper = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        next(error);
    }
}