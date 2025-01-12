import router from "./project.routes.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    toggleTaskStatus
} from "../controllers/task.controller.js";

//const router = Router();

router.route("/createTask/:id").post(verifyJWT, createTask);
router.route("/getAllTasks").get(verifyJWT, getAllTasks);
router.route("/getTaskById/:id").get(verifyJWT, getTaskById);
router.route("/updateTask/:id").put(verifyJWT, updateTask);
router.route("/deleteTask/:id").delete(verifyJWT, deleteTask);
router.route("/toggleTaskStatus/:id").put(verifyJWT, toggleTaskStatus);

export default router;
