import express from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.js";

const router = express.Router();

router.use(protect);

router.get("/", getTasks);
router.post("/", authorize("ADMIN", "MANAGER"), createTask);
router.put("/:id", updateTask); 
router.delete("/:id", authorize("ADMIN", "MANAGER"), deleteTask);

export default router;
