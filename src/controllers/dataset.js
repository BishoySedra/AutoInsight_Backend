import * as datasetService from '../services/dataset.js';
import { wrapper } from "../utils/wrapper.js";
import { sendResponse } from "../utils/response.js";

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
      
      // Save session
      await req.session.save();
      
      return sendResponse(res, { 
        domainType,
        nextStep: '/upload',
        sessionId: req.sessionID
      }, `${domainType} domain selected successfully`, 200);
    })(req, res, next);
  };

export const storeFile = (req, res) => {
    // Get uploaded file from middleware
    const datasetURL = req.file_url;
    
    // Store in session or database with pending status
    req.session.uploadData = {
      ...req.session.uploadData,
      step: 'upload',
      fileUrl: datasetURL,
      status: 'pending'
    };
    
    return sendResponse(res, { 
      fileUrl: datasetURL,
      nextStep: '/processing-options' 
    }, "File uploaded successfully", 200);
  };


  export const selectOptions = (req, res) => {
    // Get processing preferences
    const { analysis_option , downloadAfterCreating } = req.body;
    
    // Update session data
    req.session.uploadData.processingOptions = {
      analysis_option,
      downloadAfterCreating
    };
    req.session.uploadData.step = 'processing';
    
    return sendResponse(res, { 
      nextStep: '/grant-access' 
    }, "Processing options saved", 200);
  };

// Access Controller
export const grantUserAccess = (req, res, next) => {
  wrapper(async (req, res, next) => {
    const { userPermissions } = req.body;
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
    
    let responseData = {
        accessGranted: true,
        usersCount: userPermissions.length
      };
      
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
export const generateInsights = async (req, res) => {
    try {
      const { uploadData } = req.session;
      const analysis_option = uploadData.processingOptions.analysis_option;
      // Pass all collected data to your analysis service
      let dataset = await datasetService.clean(
            req.userId,
            {
              dataset_name: req.body.dataset_name,
              domainType: uploadData.domainType,
              processingOptions: uploadData.processingOptions,
              userAccess: uploadData.userAccess // userAccess.users, .permissions, .owner
            },
            uploadData.fileUrl
          );
        
        if ( analysis_option === 'clean_and_generate') {
          dataset = await datasetService.analyze(
            req.userId,
            {
              dataset_name: req.body.dataset_name,
              domainType: uploadData.domainType,
              processingOptions: uploadData.processingOptions,
              userAccess: uploadData.userAccess // userAccess.users, .permissions, .owner
            },
            uploadData.fileUrl
          );
      }

      // Clear session data after successful processing
      req.session.uploadData = null;
      
      return sendResponse(res, dataset, "Dataset analyzed successfully", 201);
    } catch (error) {
      next(error);
    }
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
