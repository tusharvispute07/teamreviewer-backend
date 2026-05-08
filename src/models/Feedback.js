import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
    {
        review: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
            required: true,
        },

        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        comment: {
            type: String,
            trim: true,
        },
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

const Feedback =
    mongoose.models.Feedback ||
    mongoose.model("Feedback", feedbackSchema);

export default Feedback;