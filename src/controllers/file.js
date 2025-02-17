import axios from 'axios';
export const SendUrlToPython = async (req, res) => {
    try {
        
        const { cloudinaryUrl } = req.body;
        if (!cloudinaryUrl) {
            return res.status(400).json({
                message: "Cloudinary URL is required",
                status: 400
            });
        }
        const FASTAPI_URL = "https://ad3a-34-139-120-42.ngrok-free.app";
        console.log('Making request to FastAPI server:', FASTAPI_URL);

        const response = await axios.post(`${FASTAPI_URL}/analyze-data`, 
            { cloudinary_url: cloudinaryUrl }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 300000, // 5 minutes
            maxBodyLength: Infinity
        });

        console.log('Response received:', {
            status: response.status,
            data: response.data
        });

        res.json({
            message: "Analysis completed successfully",
            data: response.data,
            status: 200
        });

    } catch (error) {
        console.error('Error occurred:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });

        res.status(500).json({
            message: "Error processing the file",
            error: error.message,
            detail: error.response?.data?.detail || 'No additional details available',
            status: error.response?.status || 500
        });
    }
};
