import express from "express";
import {
    createReview,
    getAllReviews,
    getReviewById,
    updateReview,
    deleteReview,
    getAssignedReviews
} from "../controllers/reviewController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/assigned")
    .get(protect, getAssignedReviews);

router.route("/")
    .post(protect, admin, createReview)
    .get(protect, getAllReviews);

router.route("/:id")
    .get(protect, getReviewById)
    .put(protect, admin, updateReview)
    .delete(protect, admin, deleteReview);

export default router;
