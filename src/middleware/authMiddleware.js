import jwt from "jsonwebtoken";
import Employee from "../models/Employee.js";

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get employee from the token (excluding password)
            req.employee = await Employee.findById(decoded.id);

            if (!req.employee) {
                return res.status(401).json({
                    success: false,
                    message: "Not authorized, user not found",
                });
            }

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, token failed",
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, no token",
        });
    }
};

export const admin = (req, res, next) => {
    if (req.employee && req.employee.role === "admin") {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: "Not authorized as an admin",
        });
    }
};
