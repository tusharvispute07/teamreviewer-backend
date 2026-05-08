import express from "express";

import {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from "../controllers/employeeController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All employee routes should require a valid token AND an admin role
router.get("/", protect, admin, getEmployees);

router.post("/", protect, admin, createEmployee);

router.put("/:id", protect, admin, updateEmployee);

router.delete("/:id", protect, admin, deleteEmployee);

export default router;