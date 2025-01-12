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

router.route("/createProject").post(verifyJWT, createProject);
router.route("/getAllProjects").get(verifyJWT, getAllProjects);
router.route("/getProjectById/:id").get(verifyJWT, getProjectById);
router.route("/updateProject/:id").put(verifyJWT, updateProject);
router.route("/deleteProject/:id").delete(verifyJWT, deleteProject);

router.route("/assignUserToProject").post(verifyJWT, assignUserToProject);
router.route("/removeUserFromProject").post(verifyJWT, removeUserFromProject);

router.route("/getProjectAssignedToUser").get(verifyJWT, getProjectAssignedToUser);

export default router;

