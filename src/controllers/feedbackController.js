import Feedback from "../models/Feedback.js";
import Review from "../models/Review.js";

export const createFeedback = async (req, res) => {
    try {
        const { review, reviewer, rating, comment } = req.body;

        if (!review || !reviewer || !rating) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const feedback = await Feedback.create({
            review,
            reviewer,
            rating,
            comment,
            status: "completed",
        });

        const assignedReviewers = await Review.findById(review).populate("assignedReviewers");
        const totalAssignedReviewers = assignedReviewers.assignedReviewers.length;
        const completedFeedback = await Feedback.countDocuments({
            review: review,
            status: "completed"
        });
        if (totalAssignedReviewers === completedFeedback) {
            await Review.findByIdAndUpdate(review, {
                status: "completed",
            });
        }

        res.status(201).json({
            success: true,
            message: "Feedback created successfully",
            data: feedback,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const updateFeedback = async (req, res) => {
    try {
        const { id, rating, comment } = req.body;

        const feedback = await Feedback.findByIdAndUpdate(id, {
            rating,
            comment,
        }, {
            new: true,
            runValidators: true,
        });

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Feedback updated successfully",
            data: feedback,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Feedback deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const getAllFeedback = async (req, res) => {
    try {
        const filter = {};
        if (req.query.reviewId) {
            filter.review = req.query.reviewId;
        }

        const feedback = await Feedback.find(filter)
            .populate("review", "title")
            .populate("reviewer", "name email")

        res.status(200).json({
            success: true,
            data: feedback,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export const getFeedbackById = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id)
            .populate("review", "title")
            .populate("reviewer", "name email");

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found",
            });
        }

        res.status(200).json({
            success: true,
            data: feedback,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
