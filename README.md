# Kambaz Quiz Server App

Express.js REST API backend for the Kambaz Learning Management System (LMS). This server provides comprehensive endpoints for course management, quiz creation, student progress tracking, and assessment functionality.

## 📋 Overview

**Kambaz Quiz Server** is a robust Node.js/Express REST API that powers the Kambaz LMS platform. It handles all backend operations including user authentication, course management, quiz administration, grading, and student progress tracking with MongoDB persistence.

**Type:** REST API Backend Server  
**Category:** Learning Management System (LMS) Backend  
**Architecture:** Node.js + Express.js + MongoDB  
**Authentication:** JWT Token-based authentication  
**API Style:** RESTful with JSON request/response

## 🎯 Key Features

### User Management
- JWT-based authentication and authorization
- User registration and account management
- Role-based access control (Student, Instructor, Admin)
- User profile management with session tracking

### Course Management
- Create, update, and delete courses
- Course structure with modules and lessons
- Instructor-to-student course enrollment
- Course metadata (title, description, duration, difficulty)

### Quiz & Assessment
- Full quiz creation and management system
- Multiple question types (MCQ, short answer, essay)
- Auto-grading for objective questions
- Manual grading support for subjective questions
- Question bank and reusable question sets

### Student Progress Tracking
- Real-time progress monitoring for students
- Quiz attempt history and performance analytics
- Grade calculation and GPA tracking
- Certificate generation and achievement tracking

### Reporting & Analytics
- Student performance reports
- Course completion statistics
- Assessment analytics for instructors
- Enrollment and attendance reports

## 💻 Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 14+ LTS | Runtime environment |
| Express.js | 5.1.0 | Web framework |
| MongoDB | Latest | NoSQL database |
| Mongoose | 8.20.0 | MongoDB ODM |
| JWT | Via jsonwebtoken | Authentication |
| CORS | 2.8.5 | Cross-origin requests |
| dotenv | 17.2.3 | Environment configuration |
| axios | 1.13.2 | HTTP client |
| express-session | 1.18.2 | Session management |
| uuid | 13.0.0 | Unique identifier generation |

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ LTS
- npm 6+ or yarn
- MongoDB server (local or cloud instance like MongoDB Atlas)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/rushikesh36/kambaz-quiz-server-app.git
cd kambaz-quiz-server-app

# Install dependencies
npm install

# Create .env file with configuration
cp .env.example .env
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/kambaz
MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/kambaz

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# CORS Settings
CORS_ORIGIN=http://localhost:3000

# Session Configuration
SESSION_SECRET=your_session_secret_here

# Email Service (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### Running the Server

```bash
# Development mode with hot-reload
npm run dev

# Production mode
npm start

# The server will run on http://localhost:5000
```

## 📁 Project Structure

```
kambaz-quiz-server-app/
├── models/                  # MongoDB Mongoose schemas
│   ├── user.model.js
│   ├── course.model.js
│   ├── quiz.model.js
│   ├── question.model.js
│   ├── submission.model.js
│   └── grade.model.js
├── routes/                  # API endpoint definitions
│   ├── auth.routes.js
│   ├── users.routes.js
│   ├── courses.routes.js
│   ├── quizzes.routes.js
│   ├── questions.routes.js
│   └── grades.routes.js
├── controllers/             # Business logic handlers
│   ├── auth.controller.js
│   ├── course.controller.js
│   ├── quiz.controller.js
│   ├── submission.controller.js
│   └── grade.controller.js
├── middleware/              # Express middleware
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   ├── validation.middleware.js
│   └── cors.middleware.js
├── utils/                   # Utility functions
│   ├── jwt.utils.js
│   ├── email.utils.js
│   ├── validators.js
│   └── logger.js
├── config/                  # Configuration files
│   ├── database.config.js
│   └── server.config.js
├── index.js                 # Application entry point
├── Hello.js                 # Initial/test file
├── package.json             # Dependencies and scripts
├── .env.example             # Environment template
└── README.md               # Documentation
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register       - User registration
POST   /api/auth/login          - User login
POST   /api/auth/logout         - User logout
POST   /api/auth/refresh-token  - Refresh JWT token
GET    /api/auth/me             - Get current user
```

### Users
```
GET    /api/users               - List all users
GET    /api/users/:id           - Get user by ID
PUT    /api/users/:id           - Update user profile
DELETE /api/users/:id           - Delete user account
GET    /api/users/:id/progress  - Get user's course progress
```

### Courses
```
GET    /api/courses             - List all courses
GET    /api/courses/:id         - Get course details
POST   /api/courses             - Create new course (Instructor)
PUT    /api/courses/:id         - Update course (Instructor)
DELETE /api/courses/:id         - Delete course (Instructor)
POST   /api/courses/:id/enroll  - Enroll in course (Student)
GET    /api/courses/:id/students - Get enrolled students (Instructor)
```

### Quizzes
```
GET    /api/quizzes             - List quizzes
GET    /api/quizzes/:id         - Get quiz details
POST   /api/quizzes             - Create quiz (Instructor)
PUT    /api/quizzes/:id         - Update quiz (Instructor)
DELETE /api/quizzes/:id         - Delete quiz (Instructor)
POST   /api/quizzes/:id/attempt - Start quiz attempt (Student)
POST   /api/quizzes/:id/submit  - Submit quiz answers (Student)
```

### Questions
```
POST   /api/questions           - Create question
GET    /api/questions/:id       - Get question details
PUT    /api/questions/:id       - Update question
DELETE /api/questions/:id       - Delete question
GET    /api/quizzes/:id/questions - Get quiz questions
```

### Grades & Submissions
```
GET    /api/submissions         - List submissions (Instructor)
POST   /api/submissions/:id/grade - Grade submission (Instructor)
GET    /api/grades              - Get user's grades (Student)
GET    /api/grades/:id          - Get specific grade
PUT    /api/grades/:id          - Update grade (Instructor)
```

## 🗄️ MongoDB Schema Design

### User Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: String (student|instructor|admin),
  enrolledCourses: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Course Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  instructor: ObjectId (ref: User),
  students: [ObjectId],
  modules: [{
    title: String,
    lessons: [{
      title: String,
      content: String,
      duration: Number
    }]
  }],
  duration: Number,
  level: String (beginner|intermediate|advanced),
  createdAt: Date
}
```

### Quiz Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  course: ObjectId,
  questions: [ObjectId],
  duration: Number,
  totalMarks: Number,
  passingMarks: Number,
  shuffleQuestions: Boolean,
  showAnswers: Boolean,
  createdAt: Date
}
```

## 🔐 Security Features

### Authentication & Authorization
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Session management with express-session

### Data Protection
- Input validation and sanitization
- CORS configuration for cross-origin requests
- Rate limiting (recommended for production)
- Secure HTTP headers

### Best Practices
- Environment variables for sensitive data
- Error handling without exposing sensitive info
- SQL injection prevention via Mongoose ODM
- XSS protection via input validation

## 📊 Performance & Optimization

### Database Optimization
- Indexed fields for fast queries (email, courseId, userId)
- Lean queries for read-only operations
- Connection pooling via MongoDB driver

### API Optimization
- Response pagination for large datasets
- Selective field projection (only needed fields)
- Caching strategies for frequently accessed data
- Async/await for non-blocking operations

### Scalability
- Stateless API design for horizontal scaling
- Microservices-ready architecture
- Load balancer compatible
- Docker-ready (can be containerized)

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "status": 200,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "status": 400,
  "error": "Error message",
  "details": {}
}
```

## 🧪 Testing

```bash
# Run tests (if configured)
npm test

# Use Postman/Thunder Client for API testing
# Import the API collection from documentation
```

### Common Test Scenarios
1. User registration with valid/invalid email
2. Login with correct/incorrect credentials
3. JWT token validation and refresh
4. Course enrollment and access control
5. Quiz attempt submission and grading
6. Progress tracking accuracy

## 🚀 Deployment

### Heroku Deployment
```bash
heroku login
heroku create kambaz-server
heroku config:set NODE_ENV=production
git push heroku main
```

### AWS EC2 Deployment
```bash
# SSH into instance
# Install Node.js and MongoDB
npm install
npm start
```

### Docker Containerization
```dockerfile
FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection failed | Check MONGODB_URI in .env, ensure MongoDB is running |
| JWT token expired | User needs to refresh token or login again |
| CORS error | Verify CORS_ORIGIN in .env matches frontend URL |
| Port already in use | Change PORT in .env or kill process using the port |
| Module not found | Run `npm install` again and clear node_modules cache |

## 📚 API Documentation

For detailed API documentation with examples:
- Run the server and visit `http://localhost:5000/api-docs` (if Swagger integrated)
- Check the `docs/` folder for endpoint specifications
- Import Postman collection from `docs/postman-collection.json`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Open a Pull Request with description

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Rushikesh Wani**
- GitHub: [@rushikesh36](https://github.com/rushikesh36)
- LinkedIn: [Rushikesh Wani](https://www.linkedin.com/in/rushikesh-wani/)
- Email: rushikesh.wani@northeastern.edu

## 📞 Support

For issues, feature requests, or questions:
- Open an issue on [GitHub Issues](https://github.com/rushikesh36/kambaz-quiz-server-app/issues)
- Contact via email for urgent matters

## 🔗 Related Projects

- [Kambaz Next.js Frontend](https://github.com/rushikesh36/kambaz-next-js-app)
- [Kambaz Quiz Frontend](https://github.com/rushikesh36/kambaz-quiz)

---

**Last Updated:** February 2026  
**Status:** Active Development  
**Version:** 1.0.0  
**API Version:** v1