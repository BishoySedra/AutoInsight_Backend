import User from "../DB/models/user.js";
import dotenv from "dotenv";
import { createCustomError } from "../middlewares/errors/customError.js";

dotenv.config();

// Service to get recent 4 users
export const getRecentUsers = async () => {
    const users = await User.aggregate([
      {
        $sort: { createdAt: -1 } // Sort by createdAt descending (most recent first)
      },
      {
        $limit: 4 // Take only 4 users after sorting
      },
      {
        $project: {
          username: 1,
          email: 1,
          profile_picture: 1,
          createdAt: 1,
          _id: 0, // Uncomment this if you want to hide _id
        }
      }
    ]);
    return users;
};


export const getCountryCounts = async () => {
      const result = await User.aggregate([
        {
          $group: {
            _id: { $toLower: '$country'}, 
            count: { $sum: 1 }, 
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $project: {
            country: '$_id', 
            count: 1,
            _id: 0, 
          },
        },
      ]);
  
      return result;
  };

// Service to update profile picture
export const updateProfilePicture = async (user_id, profilePictureURL) => {
    // console.log(profilePictureURL);
    // console.log(user_id);

    // Check if user exists
    const user = await User.findById(user_id);

    if (!user) {
        throw createCustomError(`User not found`, 404);
    }

    // Update profile picture
    user.profile_picture = profilePictureURL;

    await user.save();
}

// Service to get user id by username or email
export const getUserId = async (username, email) => {
    // Check if username or email is provided
    if (!username && !email) {
        throw createCustomError(`Username or email is required`, 400);
    }

    // Check if user exists
    const user = await User.findOne({ $or: [{ username: username }, { email: email }] });

    if (!user) {
        throw createCustomError(`User not found`, 404);
    }

    return user._id;
}

// Service to get user data by user id
export const getUserData = async (userId) => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw createCustomError(`User not found`, 404);
    }
    return user;
};

// service to search users by username
export const searchUsersByUsername = async (username) => {
    try {
        // Use a case-insensitive regular expression for partial matching
        const users = await User.find({
            username: { $regex: username, $options: 'i' }
        });
        return users;
    } catch (error) {
        throw error;
    }
};

// service to get user by email
export const getUserByEmail = async (email) => {
    const user = await User.find({ email }).select("-password");
    if (!user) {
        throw createCustomError(`User not found`, 404);
    }
    return user;
}

export const getNumberOfUsers = async () => {
    const count = await User.countDocuments({});
    return count;
}

export const getJobsCounts = async () => {
        const users = await User.find({});
        const result = {};
        users.forEach(user => {
            if (result.hasOwnProperty(user.job))
                result[user.job]++;
            else 
                result[user.job] = 1;
          });
        return result;
}

export const getNumberOfUsersByMonth = async () => {
      // Aggregate query to group users by month and year, counting them
      const result = await User.aggregate([
        {
          $project: {
            year: { $year: "$CreatedAt" },
            month: { $month: "$CreatedAt" },
          },
        },
        {
          $group: {
            _id: { year: "$year", month: "$month" }, // Group by year and month
            count: { $sum: 1 }, // Count number of users in each group
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month ascending
        },
        {
          $project: {
            year: "$_id.year",
            month: "$_id.month",
            count: 1,
            _id: 0,
          },
        },
      ]);
      
      return result; // This will return an array of objects with year, month, and count
  }

export const updateUserJob = async (userId, job) => {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        throw createCustomError(`User not found`, 404);
    }
    // Update job
    user.job = job;
    await user.save();
    return user;
}