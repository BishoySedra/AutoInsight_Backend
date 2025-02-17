import Dataset from "../DB/models/dataset.js";
import { createCustomError } from "../middlewares/errors/customError.js";

// Service to add a new dataset
export const upload = async (user_id, datasetData, datasetURL) => {
    const dataset = new Dataset({
        user_id,
        dataset_name: datasetData.dataset_name,
        dataset_url: datasetURL
    });
    await dataset.save();
    return dataset;
};

// Service to read all datasets with pagination
export const readAll = async (user_id, limit, page) => {

    // set the limit of datasets per page
    const limitPerPage = parseInt(limit) || 10;

    // set the page number
    const pageNumber = parseInt(page) || 1;

    // calculate the number of datasets to skip
    const skip = (pageNumber - 1) * limitPerPage;

    // get the total number of datasets
    const totalDatasets = await Dataset.find({ user_id }).countDocuments();

    // get the datasets
    const datasets = await Dataset.find({ user_id }).skip(skip).limit(limitPerPage);

    return {
        totalDatasets,
        datasets
    };
};

// Service to read a dataset by id
export const readById = async (dataset_id) => {

    const dataset = await Dataset.findOne({ _id: dataset_id });

    if (!dataset) {
        throw createCustomError(`Dataset not found`, 404);
    }

    return dataset;
};

// Service to delete a dataset by id
export const deleteDataset = async (dataset_id, user_id) => {

    const dataset = await Dataset.findOne({ _id: dataset_id });

    if (!dataset) {
        throw createCustomError(`Dataset not found`, 404);
    }

    if (dataset.user_id.toString() !== user_id) {
        throw createCustomError(`You are not the owner of the dataset`, 400);
    }

    await dataset.deleteOne();
};

// Service to give permission to a user to access a dataset
export const share = async (dataset_id, user_id) => {

    // check if the dataset_id is valid
    const dataset = await Dataset.findOne({ _id: dataset_id });

    // check if the dataset exists
    if (!dataset) {
        throw createCustomError(`Dataset not found`, 404);
    }

    // check if the user_id is already the owner of the dataset
    if (dataset.user_id.toString() === user_id) {
        throw createCustomError(`You are already the owner of the dataset`, 400);
    }

    // check if the user_id is already in the permissions list
    if (dataset.permissions.includes(user_id)) {
        throw createCustomError(`User already has access to the dataset`, 400);
    }

    // check if the user_id is already in the permissions list
    dataset.permissions.push(user_id);

    // save the updated dataset
    await dataset.save();
};

// Service to delete permission of a user to access a dataset
export const unshare = async (dataset_id, user_id) => {

    // check if the dataset_id is valid
    const dataset = await Dataset.findOne({ _id: dataset_id });

    // check if the dataset exists
    if (!dataset) {
        throw createCustomError(`Dataset not found`, 404);
    }

    // check if the user_id is already the owner of the dataset
    if (dataset.user_id.toString() === user_id) {
        throw createCustomError(`You are the owner of the dataset`, 400);
    }

    // check if the user_id is already in the permissions list
    if (!dataset.permissions.includes(user_id)) {
        throw createCustomError(`User does not have access to the dataset`, 400);
    }

    // remove the user_id from the permissions list
    dataset.permissions = dataset.permissions.filter(permission => permission.toString() !== user_id);

    // save the updated dataset
    await dataset.save();
};

// Service to read permissions of a dataset
export const readPermissions = async (dataset_id) => {

    // check if the dataset_id is valid
    const dataset = await Dataset.findOne({ _id: dataset_id });

    // check if the dataset exists
    if (!dataset) {
        throw createCustomError(`Dataset not found`, 404);
    }

    return dataset.permissions;
};