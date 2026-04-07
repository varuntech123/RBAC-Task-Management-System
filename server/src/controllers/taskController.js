import prisma from "../utils/prisma.js";

export const getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === "ADMIN") {
      tasks = await prisma.task.findMany({
        include: { assignee: { select: { name: true, email: true } }, creator: { select: { name: true } } },
      });
    } else if (req.user.role === "MANAGER") {
      tasks = await prisma.task.findMany({
        where: {
          OR: [{ creatorId: req.user.id }, { assigneeId: req.user.id }],
        },
        include: { assignee: { select: { name: true, email: true } }, creator: { select: { name: true } } },
      });
    } else {
      tasks = await prisma.task.findMany({
        where: { assigneeId: req.user.id },
        include: { creator: { select: { name: true } } },
      });
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createTask = async (req, res) => {
  const { title, description, priority, dueDate, assigneeId } = req.body;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        creatorId: req.user.id,
        assigneeId: assigneeId || null,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, dueDate, assigneeId } = req.body;

  try {
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role === "USER" && existingTask.assigneeId !== req.user.id) {
       return res.status(403).json({ message: "Not authorized to update this task" });
    }
    
    const updateData = req.user.role === "USER" 
        ? { status } 
        : { title, description, status, priority, dueDate: dueDate ? new Date(dueDate) : null, assigneeId };

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user.role !== "ADMIN" && task.creatorId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this task" });
    }

    await prisma.task.delete({ where: { id } });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
