# codecraft-hub

🚀 Codecraft Hub:
Enterprise-Scale MERN Platform | Secure • Modular • Production-Engineered

A professionally engineered full-stack Blog Management System built using the MERN architecture.

This platform demonstrates enterprise-level backend structuring, secure authentication design, modular frontend architecture, and scalable software engineering principles.

The system is designed using real-world SaaS development standards and reflects production-ready architectural discipline, rather than academic implementation.

🏢 Executive Overview

This project represents a complete end-to-end web application lifecycle:

Structured backend API architecture

Secure authentication & authorization flow

Modular frontend engineering

Scalable folder organization

Clean separation of responsibilities

Production-aligned development practices

It demonstrates the capability to build maintainable systems suitable for startups, SaaS platforms, and scalable business applications.

🏗 System Architecture
client/
 ├── components/
 ├── pages/
 ├── services/
 └── App.js

server/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middleware/
 └── server.js
Architectural Strategy

✔ Layered backend structure
✔ RESTful API standardization
✔ Reusable UI component design
✔ Centralized API communication layer
✔ Middleware-driven security
✔ Environment-based configuration isolation

The system follows separation of concerns to ensure maintainability and future scalability.

💻 Technology Stack
Frontend Engineering Layer

React.js

Tailwind CSS

React Router DOM

Axios (centralized API layer)

Backend Engineering Layer

Node.js

Express.js

MongoDB

Mongoose ODM

Security Infrastructure

JWT-based authentication

Bcrypt password encryption

Middleware route protection

Environment variable isolation

🔐 Authentication & Authorization Architecture

The application implements a secure stateless authentication mechanism:

User registration with encrypted password storage

Secure login with JWT token issuance

Token validation middleware

Protected routes for blog management operations

Controlled access to sensitive endpoints

This reflects production-level security design patterns used in modern web applications.

🧩 Core Platform Capabilities
Content Management Lifecycle

✔ Create blog posts
✔ Retrieve all posts
✔ View single post details
✔ Update existing content
✔ Delete posts

Secure User System

✔ Authenticated registration
✔ Secure login
✔ Protected dashboard access

UI / UX Engineering

✔ Fully responsive layout
✔ Clean content hierarchy
✔ Structured dashboard design
✔ Optimized component rendering

🧠 Backend Engineering Breakdown
controllers/

Encapsulates business logic and request handling.

models/

Defines schema architecture and database modeling standards.

routes/

Implements RESTful endpoint definitions.

middleware/

Handles authentication verification and route protection.

server.js

Application entry point — initializes Express server, middleware configuration, database connectivity, and runtime environment.

🎨 Frontend Engineering Breakdown
components/

Reusable UI modules for scalability and consistency.

pages/

Route-level page components (Authentication, Dashboard, Blog Views).

services/

Centralized API communication layer using Axios abstraction.

App.js

Core routing and protected route configuration.

🛡 Security & Stability Considerations

🔒 Password encryption before database storage
🔒 Stateless JWT authentication model
🔒 Middleware-protected endpoints
🔒 Environment-based secret management
🔒 Structured error handling

The system is structured to support future enhancements such as role-based access control and rate limiting.

⚙ Development Setup
Clone Repository
git clone https://github.com/AsadLakho/blog-management-system.gitInstall Backend Dependencies
cd server
npm install
Install Frontend Dependencies
cd client
npm install
Run Backend
npm run dev
Run Frontend
npm start
📈 Engineering Competencies Demonstrated

🚀 Full-Stack MERN Architecture Design

🏗 REST API Structuring & Modular Backend Development

🔐 Secure Authentication Lifecycle Implementation

📊 MongoDB Schema Modeling & Data Management

🧩 Component-Based Frontend Engineering

📦 Production-Oriented Folder Structuring

💼 SaaS-Level Software Discipline

📌 Deployment Readiness

The architecture is deployment-ready for:

Frontend hosting platforms (Vercel / Netlify)

Backend cloud services (Render / Railway)

MongoDB Atlas integration

Deployment is currently pending and can be executed without architectural changes.

## Free Hosting Setup

The public frontend is configured for a static Vercel deployment. For a test or hobby deployment, the API can run as a Render Free web service and MongoDB Atlas can provide the database. Service quotas and plan limits can change, so check the provider pages before deploying.

### Frontend (Vercel)

1. Import this repository into Vercel and set the project root to `frontend`.
2. Use `npm run build` as the build command and `dist` as the output directory.
3. Add `VITE_API_URL=https://<your-api-service>.onrender.com/api` to the project's environment variables, then redeploy.
4. Vercel's `frontend/vercel.json` sends app routes back to the SPA entry point.
5. To use a custom domain, add a domain you own in the Vercel project's **Settings → Domains**, then set the DNS records requested by Vercel.

### API (Render) and database (MongoDB Atlas)

1. Create a Render Web Service from this repository with `Backend` as its root directory, `npm install` as the build command, and `npm start` as the start command. Select the Free instance for a hobby deployment.
2. Set `MONGO_URI` to the Atlas connection string and `JWT_SECRET` to a long, unique secret in Render's environment settings.
3. Copy the Render service URL into the Vercel `VITE_API_URL` value above.
4. Render Free services can spin down when idle, so the first API request may be slow. Their filesystem is ephemeral: newly uploaded files in `Backend/uploads` are not durable and can be lost when the service restarts or spins down. Use durable external image storage or a host with persistent disks before relying on admin uploads.

Hosting can be free while using provider subdomains. A custom domain can be connected without a hosting upgrade, but registering a normal domain name is usually a separate paid purchase; the domain must be owned and its DNS configured.

👨‍💻 Author

Asad Ali Lakho
Full-Stack MERN Developer
Hyderabad, Pakistan

Open to:

Remote International Roles

Onsite Opportunities

Enterprise & Startup Engagements

Freelance Contracts Worldwide
