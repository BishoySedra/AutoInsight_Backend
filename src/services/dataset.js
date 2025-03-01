import Dataset from "../DB/models/dataset.js";
import User from "../DB/models/user.js";
import SharedDataset from "../DB/models/shared_dataset.js";
import { createCustomError } from "../middlewares/errors/customError.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Service to add a new dataset
export const analyze = async (user_id, datasetData) => {


    // get the dataset url
    const { fileUrl, dataset_name, userAccess, dataset_id } = datasetData;

    // check if the dataset url is provided
    if (!fileUrl) {
        throw createCustomError(`Dataset URL is required`, 400);
    }

    const FASTAPI_URL = process.env.FASTAPI_URL;
    // console.log('Making request to FastAPI server:', FASTAPI_URL);

    const response = await axios.post(`${FASTAPI_URL}/analyze-data`,
        { cloudinary_url: fileUrl }, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        timeout: 300000, // 5 minutes
        maxBodyLength: Infinity
    });

    if (!response.data?.images || !Array.isArray(response.data.images)) {
        throw createCustomError("Invalid response format from analysis service", 500);
    }
    // getting images inside the response
    const images = response.data.images;
    const classifiedImages = {
        pie_chart: [],
        bar_chart: [],
        histogram: [],
        kde: [],
        correlation: [],
        summary_report: [],
        others: []
    };

    images.forEach(([base64Image, plotType]) => {
        if (classifiedImages.hasOwnProperty(plotType)) {
            classifiedImages[plotType].push(base64Image);
        } else {
            classifiedImages.others.push(base64Image);
        }
    });

    // Step 3: Process and upload images
    const uploadedImages = {
        pie_chart: [],
        bar_chart: [],
        histogram: [],
        kde: [],
        correlation: [],
        summary_report: [],
        others: []
    };

    for (const [category, imageArray] of Object.entries(classifiedImages)) {
        for (let i = 0; i < imageArray.length; i++) {
            const base64Image = imageArray[i];
            const base64Data = base64Image.split(';base64,').pop();

            if (!base64Data) {
                console.error(`Invalid base64 format in ${category} at index ${i}`);
                continue;
            }

            // Step 4: Save image to file
            const filename = `analysis_${Date.now()}_${i}.png`;
            fs.writeFileSync(filename, base64Data, { encoding: 'base64' });

            try {
                // Step 5: Upload to Cloudinary
                const result = await cloudinary.uploader.upload(filename, {
                    folder: 'analysis',
                    public_id: filename.split('.')[0],
                    overwrite: true
                });

                // Store the URL in the correct category as an object
                uploadedImages[category].push(result.secure_url);

                // Step 6: Delete local file
                fs.unlinkSync(filename);
            } catch (uploadError) {
                console.error(`Error uploading ${filename} to Cloudinary:`, uploadError);
            }
        }
    }

    console.log('Uploaded Images:', uploadedImages);
    const dataset = await Dataset.findByIdAndUpdate(dataset_id, { insights_urls: uploadedImages }, { new: true });
    return dataset;
    return uploadedImages;



    for (let i = 0; i < images.length; i++) {
        try {
            // get the image
            const image = images[i];

            // decode the base64 string
            const base64Data = image.split(';base64,').pop();
            if (!base64Data) {
                throw new Error("Invalid base64 format: Missing data");
            }
            // save the image to a file
            const filename = `analysis_${Date.now()}_${i}.png`;  // Unique timestamp-based name
            fs.writeFileSync(filename, base64Data, { encoding: 'base64' });

            // upload the image to cloudinary
            const result = await cloudinary.uploader.upload(filename, {
                folder: 'analysis',
                public_id: filename.split('.')[0],
                overwrite: true
            });

            imageUrls.push(result.secure_url);

            fs.unlinkSync(filename);
        } catch (err) {
            if (fs.existsSync(filename)) {
                fs.unlinkSync(filename);
            }
            throw createCustomError(`Image processing failed: ${err.message}`, 500);
        }
    }


};

// Service to clean a dataset
export const clean = async (user_id, datasetData) => {

    // get the dataset url
    const { fileUrl, dataset_name, userAccess } = datasetData;

    // check if the dataset url is provided
    if (!fileUrl) {
        throw createCustomError(`Dataset URL is required`, 400);
    }

    const FASTAPI_URL = process.env.FASTAPI_URL;
    // console.log('Making request to FastAPI server:', FASTAPI_URL);

    const response = await axios.post(`${FASTAPI_URL}/clean-data`,
        { cloudinary_url: fileUrl, filter_number: 10 }, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        timeout: 300000, // 5 minutes
        maxBodyLength: Infinity
    });

    console.log(response.data);

    const dataset = new Dataset({
        user_id,
        dataset_name,
        dataset_url: fileUrl,
        cleaned_dataset_url: response.data.cleaned_csv
    });

    await dataset.save();

    // looping through userAccess to grant access to the dataset to the users
    for (let i = 0; i < userAccess.length; i++) {
        await share(dataset._id, userAccess[i].user_id, userAccess[i].permission);
    }

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

    // populate the user details using the user_id
    const user = await User.findById(user_id).select("-password -__v");

    // return the datasets with the user details
    return {
        totalDatasets,
        datasets,
        user
    };
};

// Service to read a dataset by id
export const readById = async (dataset_id) => {

    // check if the dataset_id is valid
    const dataset = await Dataset.findOne({ _id: dataset_id });

    // check if the dataset exists
    if (!dataset) {
        throw createCustomError(`Dataset not found`, 404);
    }

    // populate the user details using the user_id
    const user = await User.findById(dataset.user_id).select("-password -__v");

    // return the dataset with the user details
    return {
        dataset,
        user
    };
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
export const share = async (dataset_id, user_id, permission) => {

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

    // add the username using the user_id to the shared_usernames list
    const user = await User.findById(user_id);

    // check if the user exists
    if (!user) {
        throw createCustomError(`User not found`, 404);
    }

    // check if the username is already in the shared_usernames list
    dataset.shared_usernames.push(user.username);

    // add the dataset_id and user_id to the shared_datasets collection
    const sharedDataset = new SharedDataset({
        dataset_id,
        user_id,
        permission
    });

    // save the shared dataset
    await sharedDataset.save();

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

    // remove the username using the user_id from the shared_usernames list
    const user = await User.findById(user_id);

    // check if the user exists
    if (!user) {
        throw createCustomError(`User not found`, 404);
    }

    // remove the username from the shared_usernames list
    dataset.shared_usernames = dataset.shared_usernames.filter(username => username !== user.username);

    // remove the dataset_id and user_id from the shared_datasets collection
    await SharedDataset.deleteOne({ dataset_id, user_id });

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

// Service to get all datasets shared with the user
export const readShared = async (user_id) => {

    // get the dataset_ids shared with the user
    const sharedDatasets = await SharedDataset.find({ user_id });

    // get the datasets using the dataset_ids
    const datasets = await Dataset.find({ _id: { $in: sharedDatasets.map(sharedDataset => sharedDataset.dataset_id) } });

    // populate the user details using the user_id
    const user = await User.findById(user_id).select("-password -__v");

    // return the datasets with the user details
    return {
        datasets,
        user
    };
};
