import mongoose from "mongoose";

// Define the schema for the user model with the following fields:
// - username: a string that is required and unique
// - email: a string that is required and unique
// - password: a string that is required
// - Joining date: a date that is required and has a default value of the current date
// some data set with default values after the user is created
// - profile picture: a string that has a default value of null
// - banner picture: a string that has a default value of null
// - address: a string that has a default value of null
// - availability: a string that has a default value of null
// - following: set to zero
// - followers: set to zero
// - emailVerified: set to false
// - emailVerificationToken: a string that has a default value of null
// - about_me: a string that has a default value of null
// - links: an array of objects of title and url that has a default value of an empty array

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  country: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  job: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile_picture: {
    type: String,
    default: null,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
},
  {
    timestamps: true,
  });

// Create a model for the user schema
const User = mongoose.model("User", userSchema);

// Export the user model
export default User;
