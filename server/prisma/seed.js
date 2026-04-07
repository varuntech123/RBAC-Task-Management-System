import { PrismaClient } from "../src/generated/client/client.ts";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaBetterSqlite3({ 
  url: process.env.DATABASE_URL || "file:./dev.db" 
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Emptying database...");
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  console.log("Creating Admins...");
  const admins = await Promise.all([
    prisma.user.create({ data: { email: "admin@example.com", name: "System Admin", password: hashedPassword, role: "ADMIN" } }),
    prisma.user.create({ data: { email: "admin2@example.com", name: "Security Auditor", password: hashedPassword, role: "ADMIN" } })
  ]);

  console.log("Creating Managers...");
  const managers = await Promise.all(
    ["Sarah Manager", "David Lead", "Emma Supervisor", "Michael Director", "Lisa Coordinator"].map((name, i) =>
      prisma.user.create({ data: { email: `manager${i+1}@example.com`, name, password: hashedPassword, role: "MANAGER" } })
    )
  );

  console.log("Creating Users...");
  const users = await Promise.all(
    [
      "Alice Smith", "Bob Johnson", "Charlie Brown", "Diana Prince", "Ethan Hunt",
      "Fiona Gallagher", "George Miller", "Hannah Abbott", "Ian Wright", "Julia Roberts",
      "Kevin Hart", "Laura Palmer", "Morgan Freeman", "Nathan Drake", "Olivia Munn"
    ].map((name, i) =>
      prisma.user.create({ data: { email: `user${i+1}@example.com`, name, password: hashedPassword, role: "USER" } })
    )
  );

  const allAssignables = [...managers, ...users];

  console.log("Creating Tasks...");
  const taskTitles = [
    "Implement JWT Auth", "Setup Prisma 7", "Create Dashboard UI", "Fix CSS Bugs", 
    "Audit RBAC Middleware", "Database Migration", "Write Unit Tests", "Optimize API calls",
    "Weekly Security Patch", "Frontend Refactoring", "Update README", "Deploy to Staging",
    "Configure CI/CD", "Log Cleanup", "Customer Support Ticket #102", "New Feature Request",
    "Fix Login Loop", "Mobile Responsiveness", "Add Dark Mode", "Performance Monitoring"
  ];

  const statuses = ["PENDING", "IN_PROGRESS", "COMPLETED"];
  const priorities = ["LOW", "MEDIUM", "HIGH"];

  for (let i = 0; i < 40; i++) {
    const title = `${taskTitles[i % taskTitles.length]} ${Math.floor(i / taskTitles.length) + 1}`;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const assignee = allAssignables[Math.floor(Math.random() * allAssignables.length)];
    const creator = managers[Math.floor(Math.random() * managers.length)];

    await prisma.task.create({
      data: {
        title,
        description: `Detailed description for ${title}. This is a randomly generated task for testing.`,
        status,
        priority,
        creatorId: creator.id,
        assigneeId: assignee.id,
        dueDate: new Date(Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000) // Random date within 10 days
      }
    });
  }

  console.log("Seeding complete! logic. logic.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    if (prisma) await prisma.$disconnect();
  });
