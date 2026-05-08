import Employee from "../models/Employee.js";
import { hashPassword } from "../utils/hashPassword.js";

export const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();

        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        res.status(200).json({
            success: true,
            data: employee,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const createEmployee = async (req, res) => {
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
            role,
        });

        res.status(201).json({
            success: true,
            message: "Employee created successfully",
            data: employee,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateEmployee = async (req, res) => {
    try {
        const { name, email, role } = req.body;

        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        if (email && email !== employee.email) {
            const existingEmployee = await Employee.findOne({ email });

            if (existingEmployee) {
                return res.status(400).json({
                    success: false,
                    message: "Email already in use",
                });
            }
        }

        employee.name = name || employee.name;
        employee.email = email || employee.email;
        employee.role = role || employee.role;

        await employee.save();

        res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            data: employee,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        await employee.deleteOne();

        res.status(200).json({
            success: true,
            message: "Employee deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};