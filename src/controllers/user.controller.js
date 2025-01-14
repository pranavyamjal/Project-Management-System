import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { Op } from 'sequelize';

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findByPk(userId);
        
        if (!user) {
            throw new ApiError(404, "User not found");
        }
    
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
    
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Debug log
        console.log("Received registration request:", { username, email });

        if (!username?.trim() || !email?.trim() || !password?.trim()) {
            throw new ApiError(400, "All fields are required");
        }

        const userExists = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email.toLowerCase() },
                    { username: username.toLowerCase() }
                ]
            }
        });

        if (userExists) {
            throw new ApiError(409, "User with email or username already exists");
        }

        // Debug log before creation
        console.log("Attempting to create user with:", {
            username: username.trim(),
            email: email.toLowerCase().trim()
        });

        const user = await User.create({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: password,  
            accessToken: null,  
            refreshToken: null  
        }).catch(err => {
            // Log the specific database error
            console.error("Database error during user creation:", err);
            throw new ApiError(500, `Error creating user: ${err.message}`);
        });

        const createdUser = await User.findByPk(user.id, {
            attributes: {
                exclude: ["password", "refreshToken"]
            }
        });

        if (!createdUser) {
            throw new ApiError(500, "User created but unable to fetch user details");
        }

        return res.status(201).json(
            new ApiResponse(201, createdUser, "User registered successfully")
        );

    } catch (error) {
       
        console.error("Registration error:", error);
        throw error;
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({
        where: { email: email }
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id);

    const loggedInUser = await User.findByPk(user.id, {
        attributes: {
            exclude: ["password", "refreshToken"]
        }
    });

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            { user: loggedInUser, accessToken, refreshToken },
            "User logged in successfully"
        ));
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.update(
        { refreshToken: null },
        { where: { id: req.user.id } }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findByPk(decodedToken.id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        };

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(
                200,
                { accessToken, refreshToken },
                "Access token refreshed"
            ));
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

const getCurrentUser = asyncHandler(async (req, res) => {

    if (!req.user) {
        throw new ApiError(401, "Unauthorized request");
    }

    const user = await User.findByPk(req.user.id, {
        attributes: {
            exclude: ["password", "refreshToken"]
        }
    });

    if (!user) {
        throw new ApiError(500, "Unable to fetch user details");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
    const { username, email } = req.body;

    if (!username?.trim() && !email?.trim()) {
        throw new ApiError(400, "At least one field is required for update");
    }

    const updateObject = {};
    if (username?.trim()) updateObject.username = username.trim();
    if (email?.trim()) updateObject.email = email.toLowerCase().trim();

    const updatedUser = await User.update(
        updateObject,
        { 
            where: { id: req.user.id },
            returning: true
        }
    );

    if (!updatedUser) {
        throw new ApiError(500, "Unable to update user details");
    }

    const user = await User.findByPk(req.user.id, {
        attributes: {
            exclude: ["password", "refreshToken"]
        }
    });

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const getProjectAssignedToUser = asyncHandler(async (req, res) => {
    const projects = await Project.findAll({
        include: [{
            model: User,
            where: { id: req.user.id },
            attributes: []
        }]
    });

    if (!projects) {
        throw new ApiError(500, "Unable to fetch user projects");
    }

    if (projects.length === 0) {
        throw new ApiError(404, "Projects not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, projects, "User projects fetched successfully"));
});

const getTaskAssignedToUser = asyncHandler(async (req, res) => {
    const tasks = await Task.findAll({
        include: [{
            model: Project,
            attributes: ["name", "description"],
            include: [{
                model: User,
                where: { id: req.user.id },
                attributes: [] // No need to return user data
            }]
        }]
    });

    if(!tasks) {
        throw new ApiError(500, "Unable to fetch user tasks");
    }

    if(tasks.length === 0) {
        throw new ApiError(404, "Tasks not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, tasks, "User tasks fetched successfully"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    updateUserDetails,
    getProjectAssignedToUser,
    getTaskAssignedToUser,
};