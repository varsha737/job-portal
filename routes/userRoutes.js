// import express from "express";
// import userAuth from "../middlewares/authMiddleware.js";
// import { getUserController, updateUserController } from "../controllers/userController.js";

// //router object
// const router = express.Router();

// //routes
// //GET USER DATA || POST
// router.post('/getUser', userAuth, getUserController)

// //UPDATE USER || PUT
// router.put("/update/:userId", updateUserController);

// export default router;

import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import { getUserController, updateUserController, getUserProfile, updateProfile } from "../controllers/userController.js";
import userModel from "../models/userModel.js";

// router object
const router = express.Router();

// GET USER DATA || GET
router.get('/get', userAuth, getUserController);

// UPDATE USER || PUT
router.put('/update', userAuth, updateUserController);

// Get user profile
router.get("/profile", userAuth, getUserProfile);

// Update user profile
router.put("/update-profile", userAuth, updateProfile);

export default router;
