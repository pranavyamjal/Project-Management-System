import { Router } from "express";
import { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    editUserDetails,
    getProjectAssignedToUser,
    getTaskAssignedToUser
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

//secure routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refreshAccessToken").post(refreshAccessToken);
router.route("/getCurrentUser").get(verifyJWT);
router.route("/editUserDetails").put(verifyJWT, editUserDetails);
router.route("/getProjectAssignedToUser").get(verifyJWT, getProjectAssignedToUser);
router.route("/getTasksAssignedToUser").get(verifyJWT, getTaskAssignedToUser);

export default router;