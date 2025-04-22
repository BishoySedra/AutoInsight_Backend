import Dataset from "../DB/models/dataset.js";
import User from "../DB/models/user.js";
import SharedDataset from "../DB/models/shared_dataset.js";
import { createCustomError, CustomError } from "../middlewares/errors/customError.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Service to add a new dataset
export const analyze = async (fileUrl, domainType) => {

    // check if the dataset url is provided
    if (!fileUrl) {
        throw createCustomError(`Dataset URL is required`, 400);
    }

    const FASTAPI_URL = process.env.FASTAPI_URL;
    // console.log('Making request to FastAPI server:', FASTAPI_URL);
    console.log('here 1')
    const response = await axios.post(`${FASTAPI_URL}/analyze-data`,
        { cloudinary_url: fileUrl, domainType}, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 300000, // 5 minutes
            maxBodyLength: Infinity
        });
    console.log('here 2')

    if (!response.data?.images || !Array.isArray(response.data.images)) {
        throw createCustomError("Invalid response format from analysis service", 500);
    }
    // getting images inside the response
    const images = response.data.images;
    const cleaned_dataset_url = response.data.cleaned_csv;
    const classifiedImages = {
        pie_chart: [],
        bar_chart: [],
        histogram: [],
        kde: [],
        correlation: [],
        summary_report: [],
        forecast: [],
        others: []
    };

    images.forEach((item) => {
        // Check if this is a bar_chart (which has 3 elements)
        if (item[1] === "bar_chart" || item[1] === "forecast" || item[1] === "histogram") {
            const [base64Image, plotType, filterNumber] = item;
            const imageData = { url: base64Image };
            if (filterNumber)
                imageData.filterNumber = filterNumber;
            classifiedImages[plotType].push(imageData);

        } else {
            // Handle other plot types (2 elements)
            const [base64Image, plotType] = item;
            if (classifiedImages.hasOwnProperty(plotType)) {
                classifiedImages[plotType].push(base64Image);
            } else {
                classifiedImages.others.push(base64Image);
            }
        }
    });

    

    // Step 3: Process and upload images
    const uploadedImages = {
        pie_chart: [],
        bar_chart: [],
        kde: [],
        histogram: [],
        correlation: [],
        forecast: [],
        others: []
    };

    for (const [category, imageArray] of Object.entries(classifiedImages)) {
        for (let i = 0; i < imageArray.length; i++) {
            
            let base64Image, filterNumber;
            if (category === "bar_chart" || category === "histogram" || category === "forecast") {
                base64Image = imageArray[i].url; // Extract base64 string
                filterNumber = imageArray[i].filterNumber; // Extract filter number
            } else {
                base64Image = imageArray[i]; // For other categories, it's a direct string
            }
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
                if (category === "bar_chart" || category === "histogram" || category === "forecast") {
                    uploadedImages[category].push({
                        url: result.secure_url,
                        filterNumber: filterNumber // Include filter number
                    });
                } else {
                    uploadedImages[category].push(result.secure_url);
                }
                // Step 6: Delete local file
                fs.unlinkSync(filename);
            } catch (uploadError) {
                console.error(`Error uploading ${filename} to Cloudinary:`, uploadError);
            }
        }
    }

    console.log('Uploaded Images:', uploadedImages);
    // const dataset = new Dataset({ dataset_id, dataset_url: fileUrl, insights_urls: uploadedImages, dataset_name, user_id });
    // await dataset.save();

    // looping through userAccess to grant access to the dataset to the users
    // if (Array.isArray(userAccess) && userAccess.length > 0) {
    //     for (let i = 0; i < userAccess.length; i++)
    //         await share(dataset._id, userAccess[i].user_id, userAccess[i].permission);
    // }

    return { uploadedImages, cleaned_dataset_url };
};

// Service to clean a dataset
export const clean = async (fileUrl) => {

    // check if the dataset url is provided
    if (!fileUrl) {
        throw createCustomError(`Dataset URL is required`, 400);
    }

    const FASTAPI_URL = process.env.FASTAPI_URL;
    // console.log('Making request to FastAPI server:', FASTAPI_URL);

    // make a request to the FastAPI server to clean the dataset
    const response = await axios.post(`${FASTAPI_URL}/clean-data`,
        { cloudinary_url: fileUrl }, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        timeout: 300000, // 5 minutes
        maxBodyLength: Infinity
    });
    console.log(response);
    // check if the response is valid
    if (!response.data?.cleaned_csv) {
        throw createCustomError("Invalid response format from cleaning service", 500);
    }

    // getting the cleaned dataset url from the response
    const { cleaned_csv } = response.data;

    // console.log(response.data);

    // const dataset = new Dataset({
    //     user_id,
    //     dataset_name,
    //     dataset_url: fileUrl,
    //     cleaned_dataset_url: response.data.cleaned_csv
    // });

    // // await dataset.save();

    // // looping through userAccess to grant access to the dataset to the users
    // if (Array.isArray(userAccess) && userAccess.length > 0) {
    //     for (let i = 0; i < userAccess.length; i++)
    //         await share(dataset._id, userAccess[i].userId, userAccess[i].permission);
    // }

    return cleaned_csv;
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
export const readAllShared = async (user_id, limit, page) => {

    const limitPerPage = parseInt(limit) || 10;
    const pageNumber = parseInt(page) || 1;
    const skip = (pageNumber - 1) * limitPerPage;
    const datasets = await SharedDataset.find({ user_id }).skip(skip).limit(limitPerPage);

    return datasets;
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

    // if (dataset.user_id.toString() !== user_id) {
    //     throw createCustomError(`You are not the owner of the dataset`, 400);
    // }

    await dataset.deleteOne();
    await SharedDataset.deleteMany({ dataset_id });
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

    // check if the username is already in the shared_usernames list before adding it
    if (!dataset.shared_usernames.includes(user.username)) {
        // add the user_id to the permissions list
        dataset.shared_usernames.push(user.username);

        // save the updated dataset
        await dataset.save();
    }

    // check if the user_id has already been shared the dataset
    const sharedDataset = await SharedDataset.findOne({ dataset_id, user_id });

    if (sharedDataset) {
        // check if the permission is already the same
        if (sharedDataset.permission === permission) {
            throw createCustomError(`User already has ${permission} permission`, 400);
        } else {
            sharedDataset.permission = permission;
            await sharedDataset.save();
        }
    } else {
        // add the dataset_id and user_id to the shared_datasets collection
        const sharedDataset = new SharedDataset({
            dataset_id,
            user_id,
            permission
        });

        // save the shared dataset
        await sharedDataset.save();
    }
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

    // check if the user_id has already been shared the dataset
    const sharedDataset = await SharedDataset.findOne({ dataset_id, user_id });

    if (!sharedDataset) {
        throw createCustomError(`User does not have access to the dataset`, 400);
    }

    // remove the username using the user_id from the shared_usernames list
    const user = await User.findById(user_id);

    // check if the user exists
    if (!user) {
        throw createCustomError(`User not found`, 404);
    }

    // remove the username from the shared_usernames list
    dataset.shared_usernames = dataset.shared_usernames.filter(username => username !== user.username);

    // save the updated dataset
    await dataset.save();

    // remove the dataset_id and user_id from the shared_datasets collection
    await SharedDataset.deleteOne({ dataset_id, user_id });
};

// Service to read permissions of a dataset
export const readPermissions = async (dataset_id) => {

    // check if the dataset_id is valid
    const dataset = await SharedDataset.find({ dataset_id }).select('user_id permission -_id');
    console.log(dataset);
    // check if the dataset exists
    if (!dataset) {
        throw createCustomError(`Dataset not found`, 404);
    }

    return dataset;
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

export const editDatasetName = async (dataset_id, user_id, dataset_name) => {

    // check if the dataset_id is valid
    const dataset = await Dataset.findOne({ _id: dataset_id });

    // check if the dataset exists
    if (!dataset) {
        throw createCustomError(`Dataset not found`, 404);
    }

    // // check if the user_id is the owner of the dataset
    // if (dataset.user_id.toString() !== user_id) {
    //     throw createCustomError(`You are not the owner of the dataset`, 400);
    // }

    // update the dataset name
    dataset.dataset_name = dataset_name;

    // save the updated dataset
    await dataset.save();
}
