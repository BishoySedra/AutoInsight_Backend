import upload from "../../utils/multer.js";
import cloudinary from "../../utils/cloudinary.js";

const uploadFile = (req, res, next) => {
    upload.single("file")(req, res, (err) => {

        if (err) {
            let errorMessage = err.message;

            // Check for size limit error
            if (err.code === 'LIMIT_FILE_SIZE') {
                errorMessage = 'File is too large. Maximum size is 50 MB.';
            }

            return res.status(400).json({
                message: errorMessage,
                body: null,
                status: 400
            });
        }

        // Proceed with Cloudinary upload only if there's no error
        cloudinary.uploader.upload(req.file.path, { resource_type: "auto" }, function (err, result) {

            if (err) {
                return res.status(500).json({
                    message: "Upload failed!",
                    body: null,
                    status: 500
                });
            }

            // save the result secure_url to request object
            req.file_url = result.secure_url;
            console.log(req.file);
            next();
        });
    });
};

export default uploadFile;