import { Router } from "express";
import { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    updateUserDetails,
    getProjectAssignedToUser, 
    getTaskAssignedToUser
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Internal server error
 */
router.route("/register").post(registerUser);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a user and returns a token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.route("/login").post(loginUser);

/**
 * @swagger
 * /api/v1/users/logout:
 *   post:
 *     summary: Logout a user
 *     description: Logs the user out and invalidates the token.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.route("/logout").post(verifyJWT, logoutUser);

/**
 * @swagger
 * /api/v1/users/refreshAccessToken:
 *   post:
 *     summary: Refresh access token
 *     description: Refreshes the user's access token using the refresh token.
 *     responses:
 *       200:
 *         description: Successfully refreshed access token
 *       500:
 *         description: Internal server error
 */
router.route("/refreshAccessToken").post(refreshAccessToken);

/**
 * @swagger
 * /api/v1/users/getCurrentUser:
 *   get:
 *     summary: Get current authenticated user
 *     description: Retrieves the details of the currently authenticated user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.route("/getCurrentUser").get(verifyJWT, getCurrentUser);

/**
 * @swagger
 * /api/v1/users/updateUserDetails:
 *   put:
 *     summary: Edit user details
 *     description: Updates the current user's details.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated user details
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.route("/updateUserDetails").put(verifyJWT, updateUserDetails);


/**
 * @swagger
 * /api/v1/users/getProjectAssignedToUser:
 *   get:
 *     summary: Get all projects assigned to a user
 *     description: Retrieves a list of projects assigned to the currently authenticated user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of projects assigned to the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   status:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.route("/getProjectAssignedToUser").get(verifyJWT, getProjectAssignedToUser);

/**
 * @swagger
 * /api/v1/users/getTasksAssignedToUser:
 *   get:
 *     summary: Get all tasks assigned to a user
 *     description: Retrieves a list of tasks assigned to the currently authenticated user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of tasks assigned to the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   status:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.route("/getTasksAssignedToUser").get(verifyJWT, getTaskAssignedToUser);


export default router;
