import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    assignUserToProject,
    removeUserFromProject,
    getProjectAssignedToUser
} from "../controllers/project.controller.js";

const router = Router();

/**
 * @swagger
 * /api/v1/projects/createProject:
 *   post:
 *     summary: Create a new project
 *     description: Creates a new project with the given details.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Website Redesign"
 *               description:
 *                 type: string
 *                 example: "A project to redesign the company website"
 *               status:
 *                 type: string
 *                 example: "In Progress"
 *     responses:
 *       201:
 *         description: Project successfully created
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.route("/createProject").post(verifyJWT, createProject);

/**
 * @swagger
 * /api/v1/projects/getAllProjects:
 *   get:
 *     summary: Get all projects
 *     description: Retrieves a list of all projects.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all projects
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
router.route("/getAllProjects").get(verifyJWT, getAllProjects);

/**
 * @swagger
 * /api/v1/projects/getProjectById/{id}:
 *   get:
 *     summary: Get project by ID
 *     description: Retrieve a project using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The project ID to retrieve
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A project object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 status:
 *                   type: string
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.route("/getProjectById/:id").get(verifyJWT, getProjectById);

/**
 * @swagger
 * /api/v1/projects/updateProject/{id}:
 *   put:
 *     summary: Update project details by ID
 *     description: Updates project details for the given project ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The project ID to update
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Project Name"
 *               description:
 *                 type: string
 *                 example: "Updated project description"
 *               status:
 *                 type: string
 *                 example: "Completed"
 *     responses:
 *       200:
 *         description: Project successfully updated
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.route("/updateProject/:id").put(verifyJWT, updateProject);

/**
 * @swagger
 * /api/v1/projects/deleteProject/{id}:
 *   delete:
 *     summary: Delete a project by ID
 *     description: Deletes a project using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the project to delete
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Project successfully deleted
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.route("/deleteProject/:id").delete(verifyJWT, deleteProject);

/**
 * @swagger
 * /api/v1/projects/assignUserToProject:
 *   post:
 *     summary: Assign a user to a project
 *     description: Assign a user to an existing project by providing user ID and project ID.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               projectId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User successfully assigned to project
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.route("/assignUserToProject").post(verifyJWT, assignUserToProject);

/**
 * @swagger
 * /api/v1/projects/removeUserFromProject:
 *   post:
 *     summary: Remove a user from a project
 *     description: Removes a user from an existing project.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               projectId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User successfully removed from project
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.route("/removeUserFromProject").post(verifyJWT, removeUserFromProject);

/**
 * @swagger
 * /api/v1/projects/getProjectAssignedToUser:
 *   get:
 *     summary: Get all projects assigned to a user
 *     description: Retrieves a list of projects assigned to the authenticated user.
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

export default router;
