import Review from "../models/Review.js";
import Feedback from "../models/Feedback.js";

export const createReview = async (req, res) => {
    try {
        const { title, employee, assignedReviewers } = req.body;

        if (
            !title ||
            !employee ||
            !assignedReviewers ||
            !Array.isArray(assignedReviewers) ||
            assignedReviewers.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (assignedReviewers.includes(employee)) {
            return res.status(400).json({
                success: false,
                message: "Employee cannot review themselves",
            });
        }


        const uniqueReviewers = [...new Set(assignedReviewers)];

        const review = await Review.create({
            title,
            employee,
            assignedReviewers: uniqueReviewers,
        });

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("employee", "name email")
            .populate("assignedReviewers", "name email");

        for (const review of reviews) {
            const completedFeedbackCount = await Feedback.countDocuments({ review: review._id, status: "completed" })
            if (completedFeedbackCount === review.assignedReviewers.length) review.status = "completed";

        }

        res.status(200).json({
            success: true,
            data: reviews,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

export const getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate("employee", "name email")
            .populate("assignedReviewers", "name email");

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        res.status(200).json({
            success: true,
            data: review,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, employee, assignedReviewers } = req.body;

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        if (assignedReviewers.includes(employee)) {
            return res.status(400).json({
                success: false,
                message: "Employee cannot review themselves",
            });
        }

        const uniqueReviewers = [...new Set(assignedReviewers)];

        review.title = title || review.title;
        review.employee = employee || review.employee;
        review.assignedReviewers = uniqueReviewers || review.assignedReviewers;

        await review.save();

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: review,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export const getAssignedReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ assignedReviewers: req.employee._id })
            .populate("employee", "name email");
        const feedbacks = await Feedback.find({ reviewer: req.employee._id });
        const feedbackMap = {};
        feedbacks.forEach(f => {
            feedbackMap[f.review.toString()] = f.status || 'completed';
        });

        const assignedReviews = reviews.map(review => {
            const reviewObj = review.toObject();
            reviewObj.status = feedbackMap[review._id.toString()] || 'pending';
            return reviewObj;
        });

        res.status(200).json({
            success: true,
            data: assignedReviews,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
