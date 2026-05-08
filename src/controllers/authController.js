import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import Employee from "../models/Employee.js";
import { hashPassword } from "../utils/hashPassword.js";

const generateToken = (employeeId) => {
    return jwt.sign(
        {
            id: employeeId,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    )
};

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }

        const existingEmployee = await Employee.findOne({ email });

        if (existingEmployee) {
            return res.status(400).json({
                success: false,
                message: "Employee already exists with this email",
            });
        }

        const hashedPassword = await hashPassword(password);

        const employee = await Employee.create({
            name,
            email,
            password: hashedPassword,
            role: role || "employee",
        });

        const token = generateToken(employee._id);

        res.status(201).json({
            success: true,
            message: "Employee registered successfully",
            token,
            data: employee,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const employee = await Employee.findOne({ email }).select("+password");

        if (!employee) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isPasswordMatched = await bcrypt.compare(password, employee.password);

        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = generateToken(employee._id);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            data: employee,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};