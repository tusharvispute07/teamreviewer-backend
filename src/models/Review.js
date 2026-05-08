import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },

        assignedReviewers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Employee",
            },
        ],

        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;