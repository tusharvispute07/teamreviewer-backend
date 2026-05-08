import express from "express";
import {
    createFeedback,
    updateFeedback,
    deleteFeedback,
    getAllFeedback,
    getFeedbackById
} from "../controllers/feedbackController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
    .post(protect, createFeedback)
    .get(protect, getAllFeedback)
    .put(protect, updateFeedback);

router.route("/:id")
    .get(protect, getFeedbackById)
    .delete(protect, admin, deleteFeedback);

export default router;
