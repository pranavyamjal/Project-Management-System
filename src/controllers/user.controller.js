import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/AsyncHandler.js";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async(userId) => {

try {
        const user = await User.findByPk(userId);
    
    
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        // Update the refresh token
        user.refreshToken = refreshToken;
    
        // Save the user without running validation
        await user.save({ validateBeforeSave: false });


        return {accessToken, refreshToken}

} catch (error) {
    console.log('Error while generation of tokens ', error);
}

}

const registerUser = asyncHandler( async (req, res) =>{
    // get user details from frontend (body)
    // validations
    // check if user exists already 
    // create user object - entru in db
    // remove password and refresh token fron res
    // check for user creation 
    // return res


    const {username, email, password} = req.body

    if(!(username && email && password)){
        throw new ApiError(400, "All fields are required")
    }

    const userExists = await User.findOne({where: [{email}, {username}]})

    if(userExists){
        throw new ApiError(400, "User already exists")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password
    })

    const createdUser = await User.findByPk(user.id, {
        attributes: {
            exclude: ["password", "refreshToken"]
        }
    })

    if(!createdUser){
        throw new ApiError(400, "User not found")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, createdUser, "User created successfully")
    )

})

const login = asyncHandler(async (req, res) => {

    // get user details from frontend (body)
    const {email, password} = req.body

    if(!(email && password)){
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findOne({where: [{email}]})
    if(!user){
        throw new ApiError(400, "User not found")
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid password")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user.id)

    const loggedInUser = await User.findByPk(user.id, {
        attributes: {
            exclude: ["password", "refreshToken"]
        }
    })

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, loggedInUser, "User logged in successfully")
    )

})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByPkandUpdate(req.user.id, {
        $unset: 
        {
            refreshToken: null
        }
    },
    {new: true}
)

const options = {
    httpOnly: true,
    secure: true
}

return res
.status(200)
.clearCookie("accessToken", options)
.clearCookie("refreshToken", options)
.json(
    new ApiResponse(200, null, "User logged out successfully")
)

})


refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies.refreshAccessToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(400, "Refresh token is required")
    }

    const decodedRefreshToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findByPk(decodedRefreshToken?.id)

    if(!user){
        throw new ApiError(400, "User not found")
    }

    if(incomingRefreshToken !== user.refreshToken){
        throw new ApiError(400, "Invalid refresh token")
    }

    // cookies
    const options = {
        httpOnly: true,
        secure: true
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user.id)

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, null, "Access token refreshed successfully")
    )
})


const getCurrentUser = asyncHandler(async (req, res) => {

    return res
    .status(200)
    .json(
        new ApiResponse(200, req.user, "User details fetched successfully")
    )

})

const editUserDetails = asyncHandler(async (req, res) => {

    const {username, email, password} = req.body

    await User.findByPkandUpdate(req.user.id, {
        username,
        email,
        password
    },
    {new: true}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "User details updated successfully")
    )

})

const getProjectAssignedToUser = asyncHandler(async (req, res) => {

    const projects = await Project.findAll({
        where: {
            userId: req.user.id
        }
    })

    if(!projects){
        throw new ApiError(400, "Projects not found")
    }



    return res
    .status(200)
    .json(
        new ApiResponse(200, projects, "Projects assigned to user")
    )

})


const getTaskAssignedToUser = asyncHandler(async (req, res) => {

    const tasks = await Task.findAll({
        where: {
            userId: req.user.id
        }
    })

    if(!tasks){
        throw new ApiError(400, "Tasks not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, tasks, "Tasks assigned to user")
    )

})

export {

    generateAccessAndRefreshTokens,
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    editUserDetails,
    getProjectAssignedToUser,
    getTaskAssignedToUser

}