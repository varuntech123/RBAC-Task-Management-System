import prisma from "../utils/prisma.js";

export const getStats = async (req, res) => {
  try {
    const { role, id } = req.user;

    // Base queries for different roles
    const userCount = await prisma.user.count();
    const taskCount = await prisma.task.count();

    let taskStats;
    let priorityStats;

    if (role === 'ADMIN') {
      taskStats = await prisma.task.groupBy({
        by: ['status'],
        _count: { _all: true }
      });
      priorityStats = await prisma.task.groupBy({
        by: ['priority'],
        _count: { _all: true }
      });
    } else if (role === 'MANAGER') {
      // Tasks created by or assigned to the manager
      taskStats = await prisma.task.groupBy({
        by: ['status'],
        where: { OR: [{ creatorId: id }, { assigneeId: id }] },
        _count: { _all: true }
      });
      priorityStats = await prisma.task.groupBy({
        by: ['priority'],
        where: { OR: [{ creatorId: id }, { assigneeId: id }] },
        _count: { _all: true }
      });
    } else {
      // Tasks assigned to the user
      taskStats = await prisma.task.groupBy({
        by: ['status'],
        where: { assigneeId: id },
        _count: { _all: true }
      });
      priorityStats = await prisma.task.groupBy({
        by: ['priority'],
        where: { assigneeId: id },
        _count: { _all: true }
      });
    }

    // Format stats for frontend
    const stats = {
      totalUsers: userCount,
      totalTasks: role === 'ADMIN' ? taskCount : taskStats.reduce((acc, curr) => acc + curr._count._all, 0),
      byStatus: taskStats.reduce((acc, curr) => ({ ...acc, [curr.status]: curr._count._all }), {}),
      byPriority: priorityStats.reduce((acc, curr) => ({ ...acc, [curr.priority]: curr._count._all }), {})
    };

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching stats" });
  }
};
