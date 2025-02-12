import * as datasetService from '../services/dataset.js';
import { wrapper } from "../utils/wrapper.js";
import { sendResponse } from "../utils/response.js";

// Controller to add a new dataset
export const upload = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const datasetData = req.body;
        const user_id = req.userId;
        const datasetURL = req.file_url;
        const dataset = await datasetService.upload(user_id, datasetData, datasetURL);
        return sendResponse(res, dataset, "Dataset added successfully", 201);
    })(req, res, next);
}
