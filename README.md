# 🛡️ Secure RBAC Task Management System

A production-ready, full-stack Task Management application featuring Role-Based Access Control (RBAC), secure authentication, and a modern analytics dashboard.

![Admin Analytics](screenshots/admin_analytics_dashboard_1775562760915.png)

## 🚀 Key Features

- **🔐 Multi-Role RBAC**: Granular permissions for **Admin**, **Manager**, and **User** roles.
- **📊 Real-time Analytics**: Visualized metrics for task distribution, priorities, and team productivity.
- **🛡️ Security First**: JWT authentication via `httpOnly` cookies, password hashing with `bcryptjs`, and XSS/CSRF protections.
- **⚡ Modern Tech Stack**: 
  - **Backend**: Node.js, Express, Prisma 7 ORM.
  - **Frontend**: React (Vite), Vanilla CSS (Glassmorphism), Lucide Icons.
  - **Database**: SQLite with `better-sqlite3` driver.

## 🛠️ Installation & Setup

### 1. Prerequisite
- Node.js (v18+)
- npm or yarn

### 2. Backend Setup
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file and add your `DATABASE_URL` and `JWT_SECRET`:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your_secret_key"
   ```
4. Initialize the database and seed it:
   ```bash
   npx prisma generate
   npm run seed
   ```
5. Start the server: `npm run dev`

### 3. Frontend Setup
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## 👥 Roles & Permissions

- **Admin**: Full access to user management (create/delete/update) and system-wide analytics.
- **Manager**: Create and assign tasks to team members, track progress, and view team analytics.
- **User**: View assigned tasks and update statuses (Pending, In Progress, Completed).

## 📸 Screenshots

````carousel
![Manager Assignment](screenshots/manager_assignee_selected_1775562677665.png)
<!-- slide -->
![User Dashboard Stats](screenshots/manager_dashboard_stats_1775562063644.png)
````

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
