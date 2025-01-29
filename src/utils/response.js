// function to send response to client
export const sendResponse = (res, body, message, status) => {
    res.status(status).json({ message, body, status });
};