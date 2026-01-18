# Job Application Tracker - MERN Stack

A full-stack web application for tracking job applications from multiple portals with features like Kanban board, filtering, CSV import/export, and follow-up management.

## 🚀 Features

### Authentication
- Email/password authentication with JWT
- Secure httpOnly cookies
- Protected routes on frontend
- Session management

### Application Management
- **CRUD Operations**: Create, read, update, and delete job applications
- **Comprehensive Fields**: Track company, job title, portal, location, employment type, salary, recruiter info, and more
- **Status Tracking**: Monitor application progress through multiple stages (Backlog → Applied → Interviews → Offer/Rejected)
- **Status History**: Automatic tracking of all status changes with timestamps
- **Interaction Logging**: Log calls, emails, and interviews with dates and notes

### Views & Organization
- **Dashboard**: Overview with statistics cards and recent applications
- **Kanban Board**: Drag-and-drop interface to update application status
- **All Applications**: Filterable, searchable, paginated list view
- **Application Details**: Comprehensive view with timeline and interaction history
- **Follow-ups**: Dedicated view for applications needing follow-up, with overdue highlighting

### Advanced Features
- **Filtering**: Filter by portal, status, location, employment type, date range
- **Search**: Text search across company names and job titles
- **Sorting**: Sort by date applied, company name, or status
- **Pagination**: Efficient handling of large datasets
- **CSV Import**: Bulk import applications from CSV files
- **CSV Export**: Export all applications to CSV for backup or analysis

### UI/UX
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean interface with Tailwind CSS
- **Status Colors**: Color-coded badges for quick status identification
- **Portal Badges**: Visual indicators for different job portals
- **Toast Notifications**: User-friendly feedback for all actions

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **Validation**: express-validator
- **File Processing**: multer, csv-parser, json2csv
- **Language**: TypeScript

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **Drag & Drop**: @dnd-kit
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Notifications**: react-hot-toast
- **Language**: TypeScript

### Testing
- **Framework**: Jest
- **API Testing**: Supertest
- **Database**: MongoDB Memory Server (for isolated tests)

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd job-tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/job-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### Production Mode

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Tests with Coverage
```bash
cd backend
npm test -- --coverage
```

## 🌱 Seed Database

To populate the database with demo data:

```bash
cd backend
npm run seed
```

This creates:
- Demo user: `demo@example.com` / `password123`
- 10 sample applications across different statuses and portals

## 📁 Project Structure

```
job-tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Application.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── errorHandler.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   └── applications.ts
│   │   ├── scripts/
│   │   │   └── seed.ts
│   │   ├── __tests__/
│   │   │   ├── auth.test.ts
│   │   │   └── applications.test.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axios.ts
    │   │   ├── auth.ts
    │   │   └── applications.ts
    │   ├── components/
    │   │   ├── Layout.tsx
    │   │   ├── Navbar.tsx
    │   │   ├── Sidebar.tsx
    │   │   ├── ProtectedRoute.tsx
    │   │   ├── StatusBadge.tsx
    │   │   ├── ApplicationCard.tsx
    │   │   └── ApplicationFormModal.tsx
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   ├── hooks/
    │   │   ├── useAuth.ts
    │   │   └── useApplications.ts
    │   ├── pages/
    │   │   ├── LoginPage.tsx
    │   │   ├── RegisterPage.tsx
    │   │   ├── DashboardPage.tsx
    │   │   ├── KanbanPage.tsx
    │   │   ├── ApplicationsPage.tsx
    │   │   ├── ApplicationDetailPage.tsx
    │   │   └── FollowUpsPage.tsx
    │   ├── types/
    │   │   └── index.ts
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── tsconfig.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Applications
- `POST /api/applications` - Create application
- `GET /api/applications` - Get all applications (with filters)
- `GET /api/applications/:id` - Get single application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application
- `GET /api/applications/follow-ups` - Get follow-up applications
- `GET /api/applications/export` - Export to CSV
- `POST /api/applications/import` - Import from CSV
- `POST /api/applications/:id/interactions` - Add interaction

### Query Parameters (GET /api/applications)
- `portal` - Filter by job portal
- `status` - Filter by status
- `location` - Filter by location
- `employmentType` - Filter by employment type
- `dateFrom` - Filter by start date
- `dateTo` - Filter by end date
- `search` - Search company/job title
- `sortBy` - Sort field (dateApplied, companyName, status)
- `order` - Sort order (asc, desc)
- `page` - Page number
- `limit` - Items per page

## 🎨 Application Fields

Each application tracks:
- **Basic Info**: Company name, job title, job portal, job link
- **Location**: Location, employment type (Full-time, Part-time, etc.)
- **Dates**: Date applied, follow-up date
- **Status**: Current status with history tracking
- **Source**: How you found the job (Referral, Direct, Job board, Recruiter)
- **Compensation**: Salary range
- **Recruiter**: Name, email, phone
- **Notes**: Additional notes
- **Resume**: Resume version used
- **Interactions**: Log of all communications
- **Timestamps**: Created and updated dates

## 🎯 Status Flow

1. **Backlog** - Saved for later
2. **Applied** - Application submitted
3. **HR Screen** - Initial screening
4. **Technical Round** - Technical interview
5. **Managerial Round** - Manager interview
6. **Offer** - Offer received
7. **Rejected** - Application rejected
8. **On hold** - Process paused

## 🔒 Security Features

- Password hashing with bcrypt
- JWT tokens stored in httpOnly cookies
- CORS configuration
- Input validation and sanitization
- Protected API routes
- XSS protection

## 🚧 Future Enhancements

- Email notifications for follow-ups
- Analytics and insights dashboard
- Resume upload and storage
- Interview preparation notes
- Salary comparison tools
- Application templates
- Mobile app (React Native)
- Calendar integration
- Chrome extension for quick adds



## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email: yashrajsherke49@gmail.com or open an issue in the repository.

---

**Built with ❤️ using the MERN stack**
