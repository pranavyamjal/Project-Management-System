import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    toggleTaskStatus 
} from "../controllers/task.controller.js";

const router = Router();

/**
 * @swagger
 * /api/v1/tasks/createTask/{id}:
 *   post:
 *     summary: Create a new task
 *     description: Create a new task under the specified project ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The project ID to associate the task with
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task successfully created
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.route("/createTask/:id").post(verifyJWT, createTask);

/**
 * @swagger
 * /api/v1/tasks/getAllTasks:
 *   get:
 *     summary: Get all tasks
 *     description: Retrieves a list of all tasks.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
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
router.route("/getAllTasks").get(verifyJWT, getAllTasks);

/**
 * @swagger
 * /api/v1/tasks/getTaskById/{id}:
 *   get:
 *     summary: Get task by ID
 *     description: Retrieves the task details for the specified task ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The task ID to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task details retrieved successfully
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
 *       400:
 *         description: Invalid task ID
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.route("/getTaskById/:id").get(verifyJWT, getTaskById);

/**
 * @swagger
 * /api/v1/tasks/updateTask/{id}:
 *   put:
 *     summary: Update a task
 *     description: Updates an existing task for a specified task ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The task ID to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task successfully updated
 *       400:
 *         description: Invalid data or task ID
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.route("/updateTask/:id").put(verifyJWT, updateTask);

/**
 * @swagger
 * /api/v1/tasks/deleteTask/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Deletes a task for a specified task ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The task ID to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task successfully deleted
 *       400:
 *         description: Invalid task ID
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.route("/deleteTask/:id").delete(verifyJWT, deleteTask);

/**
 * @swagger
 * /api/v1/tasks/toggleTaskStatus/{id}:
 *   put:
 *     summary: Toggle task status
 *     description: Toggles the status of a specified task between "completed" and "in-progress".
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The task ID to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task status successfully toggled
 *       400:
 *         description: Invalid task ID
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.route("/toggleTaskStatus/:id").put(verifyJWT, toggleTaskStatus);


export default router;
