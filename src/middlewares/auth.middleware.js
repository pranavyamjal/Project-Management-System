import  ApiError  from "../utils/ApiError.js";  // Custom error handling
import asyncHandler from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken";  // JWT verification
import  User  from "../models/user.model.js";  // User model

// Middleware to verify JWT token
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // Retrieve token from cookies or Authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      // If no token is found, throw an Unauthorized error
      throw new ApiError(401, "Unauthorized request");
    }

    // Verify the token using the ACCESS_TOKEN_SECRET from environment
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the user based on the decoded _id (exclude sensitive fields like password and refreshToken)
    const user = await User.findByPk(decodedToken.id, { attributes: { exclude: ["password", "refreshToken"] } });

    if (!user) {
      // If the user does not exist or token is invalid, throw an Invalid Access Token error
      throw new ApiError(401, "Invalid Access Token");
    }

    // Attach the user object to the request for future middleware/handlers
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If any error occurs (including token verification or user lookup failure), throw an Unauthorized error
    throw new ApiError(401, error?.message || "Invalid access token");
  }

});
