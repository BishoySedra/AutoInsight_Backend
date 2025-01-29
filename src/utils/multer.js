import multer from 'multer';

const MAX_SIZE = 50 * 1024 * 1024; // 50 MB in bytes

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedMimeTypes = [
        // Image MIME types
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
        'image/tiff',
        'image/svg+xml',

        // CSV File MIME types
        'text/csv'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);  // Accept the file
    } else {
        cb(new Error('Invalid file type. Only images, CSV files are allowed.'), false);  // Reject the file
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: MAX_SIZE },  // Set file size limit to 50 MB
});

export default upload;
