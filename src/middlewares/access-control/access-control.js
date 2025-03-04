import SharedDataset from "../../DB/models/shared_dataset.js";
import Dataset from "../../DB/models/dataset.js";
import { createCustomError } from "../errors/customError.js";

const checkPermission = (requiredPermission) => async (req, res, next) => {
    try {
        const { dataset_id } = req.params;
        // console.log("dataset_id", dataset_id);
        const userId = req.userId;
        // console.log("userId", userId);
        // Check if the dataset exists
        const dataset = await Dataset.findById(dataset_id);

        if (!dataset) {
            throw new createCustomError("Dataset Not Found", 404, null);
        }

        // Check if the user is the owner of the dataset
        if (dataset.user_id.toString() === userId) {
            // console.log("dataset.user_id", dataset.user_id);
            // console.log("userId", userId);
            next(); // User is the owner, proceed to the next middleware/controller
            return;
        }

        // Find the user's permission for the dataset
        const sharedDataset = await SharedDataset.findOne({
            dataset_id,
            user_id: userId
        });

        if (!sharedDataset) {
            throw new createCustomError("Access Denied: Dataset Not Shared", 403, null);
        }

        const userPermission = sharedDataset.permission;

        // Define permission levels
        const permissionLevels = { view: 1, edit: 2, admin: 3 };

        if (permissionLevels[userPermission] < permissionLevels[requiredPermission]) {
            console.log(permissionLevels[userPermission], permissionLevels[requiredPermission]);
            throw new createCustomError("Access Denied: Insufficient Permission", 403, null);
        }

        next(); // User has permission, proceed to the next middleware/controller
    } catch (error) {
        next(error);
    }
};

export default checkPermission;
