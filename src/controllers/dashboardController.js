import Review from "../models/Review.js";
import Feedback from "../models/Feedback.js";
import Employee from "../models/Employee.js";

export const getDashboardData = async (req, res) => {
    try {
        if (req.employee.role === "admin") {
            const totalEmployees = await Employee.countDocuments();
            const pendingReviews = await Review.countDocuments({
                status: "pending",
            });
            const completedReviews = await Review.countDocuments({
                status: "completed",
            });
            const totalReviews = await Review.countDocuments();

            const recentActivity = await Review.find()
                .sort({ updatedAt: -1 })
                .populate("employee", "name email")
                .limit(5);

            res.status(200).json({
                success: true,
                data: {
                    totalEmployees,
                    pendingReviews,
                    completedReviews,
                    totalReviews,
                    recentActivity
                },
            });
        } else {
            // Employee role
            const totalAssignedReviews = await Review.countDocuments({
                assignedReviewers: req.employee._id
            });
            const feedbacksSubmitted = await Feedback.countDocuments({
                reviewer: req.employee._id
            });
            const reviewsRequired = totalAssignedReviews - feedbacksSubmitted;

            // Find reviews where this employee is the subject
            const myReviews = await Review.find({ employee: req.employee._id }).select('_id');
            const myReviewIds = myReviews.map(r => r._id);
            
            // Count feedbacks submitted for these reviews
            const feedbackReceived = await Feedback.countDocuments({
                review: { $in: myReviewIds }
            });

            res.status(200).json({
                success: true,
                data: {
                    reviewsRequired,
                    feedbackReceived,
                    actionItems: []
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};