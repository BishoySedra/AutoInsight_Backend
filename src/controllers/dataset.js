import * as datasetService from '../services/dataset.js';
import { wrapper } from "../utils/wrapper.js";
import { sendResponse } from "../utils/response.js";
import { createCustomError } from "../middlewares/errors/customError.js";

// Controller to add a new dataset
export const upload = async (req, res, next) => {
  wrapper(async (req, res, next) => {
    const datasetData = req.body;
    const user_id = req.userId;
    const datasetURL = req.file_url;
    const dataset = await datasetService.analyze(user_id, datasetData, datasetURL);
    return sendResponse(res, dataset, "Dataset added successfully", 201);
  })(req, res, next);
}

// Controller to select domain
export const selectDomain = (req, res, next) => {
  wrapper(async (req, res, next) => {
    const { domainType } = req.body;
    const user_id = req.userId;

    // Validate domain type
    const validDomains = ['ecommerce', 'HR'];
    if (!validDomains.includes(domainType)) {
      throw createCustomError('Invalid domain type selected', 400);
    }

    // Initialize or update session data for this user's current workflow
    if (!req.session.uploadData) {
      req.session.uploadData = {};
    }

    // Store domain information
    req.session.uploadData = {
      ...req.session.uploadData,
      user_id,
      domainType,
      step: 'domain-selected',
      timestamp: new Date().toISOString()
    };

    // console.log(req.sessionID)

    console.log('Domain selected step');
    console.log('Session data:', req.session);
    console.log("=====================================");

    // console.log("response headers", res.getHeaders());

    // Save session
    await req.session.save();

    return sendResponse(res, {
      domainType,
      nextStep: '/upload',
      sessionId: req.sessionID
    }, `${domainType} domain selected successfully`, 200);
  })(req, res, next);
};

// Controller to store uploaded file
export const storeFile = (req, res, next) => {
  wrapper(async (req, res, next) => {
    // Get uploaded file from middleware
    const datasetURL = req.file_url;

    // Store in session or database with pending status
    req.session.uploadData = {
      ...req.session.uploadData,
      step: 'upload',
      fileUrl: datasetURL,
      status: 'pending'
    };

    // Save session
    await req.session.save();

    console.log('File uploaded step');
    console.log('Session data:', req.session);
    console.log("=====================================");


    return sendResponse(res, {
      fileUrl: datasetURL,
      nextStep: '/processing-options'
    }, "File uploaded successfully", 200);
  })(req, res, next);
};

// Controller to select processing options
export const selectOptions = (req, res) => {
  // Get processing preferences
  const { analysis_option, downloadAfterCreating } = req.body;

  // Validate processing options
  const validOptions = ['clean_only', 'clean_and_generate'];

  if (!analysis_option || !validOptions.includes(analysis_option)) {
    return sendResponse(res, null, "Invalid processing option selected", 400);
  }

  console.log('Processing options:', analysis_option, downloadAfterCreating);
  console.log('Session data:', req.session);
  console.log('upload data:', req.session.uploadData);


  // Initialize processing options in session data
  if (!req.session.uploadData.processingOptions) {
    req.session.uploadData.processingOptions = {};
  }

  // Update session data
  req.session.uploadData.processingOptions = {
    analysis_option,
    downloadAfterCreating
  };
  req.session.uploadData.step = 'processing';

  // Save session
  req.session.save();

  console.log('Processing options step');
  console.log('Session data:', req.session);

  return sendResponse(res, {
    nextStep: '/grant-access'
  }, "Processing options saved", 200);
};

// Access Controller
export const grantUserAccess = (req, res, next) => {
  wrapper(async (req, res, next) => {

    const userPermissions = req.body.userPermissions;
    const user_id = req.userId;
    // [{ userId, 'view'}, { userId, 'admin'}, { userId, 'edit '}]

    // Validate that we have session data from previous steps
    if (!req.session.uploadData || !req.session.uploadData.domainType) {
      throw createCustomError('Missing previous step data. Please start from the beginning.', 400);
    }

    // Validate userPermissions structure
    if (!userPermissions || !Array.isArray(userPermissions)) {
      throw createCustomError('userPermissions must be provided as an array of user objects', 400);
    }

    // Validate each user permission entry
    const validPermissionTypes = ['view', 'edit', 'admin'];
    for (const entry of userPermissions) {
      if (!entry.userId || !entry.permission) {
        throw createCustomError('Each user permission entry must contain userId and permission', 400);
      }

      if (!validPermissionTypes.includes(entry.permission)) {
        throw createCustomError(`Invalid permission: ${entry.permission}. Must be one of: ${validPermissionTypes.join(', ')}`, 400);
      }
    }

    // Update session with access information
    req.session.uploadData = {
      ...req.session.uploadData,
      userAccess: {
        userPermissions,
        owner: user_id
      },
      step: 'access-granted'
    };

    // Save session
    await req.session.save();

    console.log('Access granted step');
    console.log('Session data:', req.session);
    console.log("=====================================");

    let responseData = {
      accessGranted: true,
      usersCount: userPermissions.length
    };

    const isComplete = req.session.uploadData.fileUrl && req.session.uploadData.processingOptions;

    if (isComplete) {
      responseData.nextStep = '/generate-insights';
      responseData.isComplete = true;
    } else {
      // If some previous step was skipped, direct back to it
      if (!req.session.uploadData.fileUrl) {
        responseData.nextStep = '/upload';
      } else if (!req.session.uploadData.processingOptions) {
        responseData.nextStep = '/processing-options';
      }
    }

    return sendResponse(res, responseData, "Access permissions saved successfully", 200);
  })(req, res, next);
};

// Final step that triggers the analysis
export const generateInsights = async (req, res, next) => {
  wrapper(async (req, res) => {

    const { uploadData } = req.session;

    // user_id: '67b673095e4d0a6c618b5c71', --> done!
    // domainType: 'ecommerce',
    // step: 'access-granted',
    // timestamp: '2025-03-01T01:25:36.703Z',
    // fileUrl: 'https://res.cloudinary.com/dwd6kau8a/raw/upload/v1740792348/ceivo0ba3quso76xe0jf.csv', --> done!
    // status: 'pending',
    // processingOptions: {
    //   analysis_option: 'clean_and_generate',
    //   downloadAfterCreating: true --> done!
    // },
    // userAccess: { userPermissions: [Array], owner: '67b673095e4d0a6c618b5c71' } --> done!

    const analysis_option = uploadData.processingOptions.analysis_option;

    // Pass all collected data to your analysis service
    let dataset = await datasetService.clean(
      req.userId,
      {
        dataset_name: req.body.dataset_name,
        domainType: uploadData.domainType,
        downloadOption: uploadData.processingOptions.downloadAfterCreating,
        userAccess: uploadData.userAccess,
        fileUrl: uploadData.fileUrl
      },

    );

    if (analysis_option === 'clean_and_generate') {
      dataset = await datasetService.analyze(
        req.userId,
        {
          dataset_name: req.body.dataset_name,
          domainType: uploadData.domainType,
          downloadOption: uploadData.processingOptions.downloadAfterCreating,
          userAccess: uploadData.userAccess,
          fileUrl: uploadData.fileUrl
        }
      );
    }

    // loop on this array uploadData.userAccess.userPermissions
    // for each user, create a new entry in the permissions collection

    // create a new entry in the permissions collection
    // {
    //   dataset_id: dataset._id,
    //   user_id: user_id,
    //   permission: permission
    // }

    // create a new entry in the shared_usernames collection

    // for (const userPermission of uploadData.userAccess.userPermissions) {
    //   await datasetService.share(dataset._id, userPermission.userId, userPermission.permission);
    // }

    // if (uploadData.processingOptions.downloadAfterCreating) {
    //   await datasetService.download(dataset._id);
    // }

    // Clear session data after successful processing
    req.session.uploadData = null;

    // console.log('Insights generated step');
    // console.log('Session data:', req.session);
    // console.log("=====================================");

    return sendResponse(res, dataset, "Dataset analyzed successfully", 201);
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
