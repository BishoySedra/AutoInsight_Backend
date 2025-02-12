import Dataset from "../DB/models/dataset.js";

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