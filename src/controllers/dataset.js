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

// Controller to read all datasets with pagination
export const readAll = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const user_id = req.userId;
        const { limit, page } = req.query;
        const datasets = await datasetService.readAll(user_id, limit, page);
        return sendResponse(res, datasets, "Datasets read successfully", 200);
    })(req, res, next);
}

// Controller to read a dataset by id
export const readById = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const { dataset_id } = req.params;
        const dataset = await datasetService.readById(dataset_id);
        return sendResponse(res, dataset, "Dataset read successfully", 200);
    })(req, res, next);
}

// Controller to delete a dataset by id
export const deleteDataset = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const user_id = req.userId;
        const { dataset_id } = req.params;
        await datasetService.deleteDataset(dataset_id, user_id);
        return sendResponse(res, null, "Dataset deleted successfully", 200);
    })(req, res, next);
}

// Controller to give permission to a user to access a dataset
export const share = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const { user_id } = req.body;
        const { dataset_id } = req.params;
        await datasetService.share(dataset_id, user_id);
        return sendResponse(res, null, "Dataset shared successfully", 200);
    })(req, res, next);
}

// Controller to delete permission of a user to access a dataset
export const unshare = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const { user_id } = req.body;
        const { dataset_id } = req.params;
        await datasetService.unshare(dataset_id, user_id);
        return sendResponse(res, null, "Dataset unshared successfully", 200);
    })(req, res, next);
}

// Controller to read permissions of a dataset
export const readPermissions = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const { dataset_id } = req.params;
        const permissions = await datasetService.readPermissions(dataset_id);
        return sendResponse(res, permissions, "Permissions read successfully", 200);
    })(req, res, next);
}

// Controller to get all datasets shared with the user
export const readShared = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const user_id = req.userId;
        const datasets = await datasetService.readShared(user_id);
        return sendResponse(res, datasets, "Datasets read successfully", 200);
    })(req, res, next);
}
