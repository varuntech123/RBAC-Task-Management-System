import express from "express";
import { getUsers, createUser, updateUser, deleteUser } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.js";

const router = express.Router();

router.use(protect);

// Allow both ADMIN and MANAGER to fetch users
router.get("/", authorize("ADMIN", "MANAGER"), getUsers);

// Destructive/Creation actions restricted to ADMIN only
router.post("/", authorize("ADMIN"), createUser);
router.put("/:id", authorize("ADMIN"), updateUser);
router.delete("/:id", authorize("ADMIN"), deleteUser);

export default router;
