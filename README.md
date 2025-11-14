# EVENT MANAGEMENT


## Table of Contents

*   [About The Project](#about-the-project)
*   [Features](#features)
*   [Technologies Used](#technologies-used)
*   [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
*   [Configuration](#configuration)
*   [API Endpoints](#api-endpoints)
*   [Frontend Routes](#frontend-routes)
*   [Usage](#usage)
*   [Email Functionality](#email-functionality)
*   [Stripe Integration](#stripe-integration)
*   [Admin Access](#admin-access)
*   [Contributing](#contributing)
*   [License](#license)
*   [Contact](#contact)
*   [Acknowledgements](#acknowledgements)

---

## About The Project

[Your Project Name] is a full-stack event management application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack, enhanced with Tailwind CSS for modern styling. This application allows users to browse events, book tickets, and provides an administrative interface for event and user management.

**Briefly describe what your project does, its main purpose, and who it's for.**
*Example: This platform aims to simplify event discovery and ticket booking for users, while offering powerful administrative tools for event organizers to manage their listings and user base.*

---

## Features

*   **User Authentication:** Secure user registration and login.
*   **Event Browsing:** View a list of available events.
*   **Ticket Booking:**
    *   Select events and specify ticket quantities.
    *   Secure payment processing via Stripe integration.
    *   Record and display booking details for users.
*   **User Profile Management:**
    *   Users can view their booked tickets.
*   **Admin Dashboard (Restricted Access):**
    *   **User Management:** List all registered users.
    *   **Event Management:** Create, list, update, and delete events.
*   **Email Notifications:**
    *   Welcome emails upon registration.
    *   Booking confirmation emails.
    *   Password reset (if implemented).
*   **File Uploads:** (e.g., event images) using Multer.
*   **Responsive UI:** Built with Tailwind CSS for a seamless experience across devices.

---

## Technologies Used

This project leverages a robust set of modern web technologies:

*   **Frontend:**
    *   [React.js] - A JavaScript library for building user interfaces.
    *   [Tailwind CSS]- A utility-first CSS framework for rapidly building custom designs.
    *   [React Router Dom]- For declarative routing in React applications.
    *   [Axios] - Promise-based HTTP client for the browser and Node.js.
    *   [Stripe/react-stripe-js] React components for Stripe.
*   **Backend:**
    *   [Node.js] - JavaScript runtime for server-side development.
    *   [Express.js]- A fast, unopinionated, minimalist web framework for Node.js.
    *   [Mongoose]- MongoDB object modeling for Node.js.
    *   [JSON Web Tokens (JWT)] - For secure authentication.
    *   [Bcrypt.js] - For password hashing.
    *   [Multer]- A Node.js middleware for handling `multipart/form-data`, primarily used for uploading files.
    *   [Nodemailer] - Module for Node.js applications to allow easy email sending.
    *   [Stripe]- For payment processing.
    *   [Dotenv] - To load environment variables from a `.env` file.
    *   [CORS] - Node.js middleware for enabling Cross-Origin Resource Sharing.
*   **Database:**
    *   [MongoDB] - A NoSQL database for flexible data storage(Cloud MongoDB).

---

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/en/download/) (LTS recommended)
*   [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
*   [MongoDB](https://www.mongodb.com/docs/manual/installation/) (local instance or a cloud service like MongoDB Atlas)
*   [Git](https://git-scm.com/downloads) (for cloning the repository)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/kannan1107/eventUI.git
    ```

2.  **Navigate to the backend directory and install dependencies:**
    ```bash
    cd backend # Or server, api, etc. depending on your project structure
    npm install
    ```

3.  **Navigate to the frontend directory and install dependencies:**
    ```bash
    cd ../frontend # Adjust path based on your project structure
    npm install
    ```

---

## Configuration

Both the frontend and backend require environment variables. Create a `.env` file in both the `backend` and `frontend` root directories.

### Backend (`backend/.env`)

```env
PORT=5000 # Or your desired port
MONGO_URI=mongodb://localhost:27017/[your_database_name] # e.g., mongodb://localhost:27017/eventdb or your MongoDB Atlas URI
JWT_SECRET=YOUR_SECRET_KEY_FOR_JWT # Generate a strong, random string
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY # Get from Stripe Dashboard
EMAIL_USER=your_email@example.com # Email address for Nodemailer (e.g., Gmail, SendGrid)
EMAIL_PASS=your_email_password_or_app_password # Password or app-specific password for the email account
CLIENT_URL=http://localhost:5000 # URL of your React frontend


### Frontend (`frontend/.env`)
```env
REACT_APP_STRIPE_KEY=pk_test_YOUR_STRIPE_PUBLIC_KEY # Get from Stripe Dashboard---
REACT_APP_API_URL=http://localhost:5000/api # Backend API URL---
```
*Note: Replace placeholders with your actual configuration values.*
---

## API Endpoints
The backend exposes the following API endpoints:
*   **Authentication:**
    *   `POST /api/auth/register` - Register a new user.
    *   `POST /api/auth/login` - Login and obtain a JWT token.
*   **Events:**
    *   `GET /api/events` - List all events.
    *   `POST /api/events` - Create a new event (Admin only).
    *   `PUT /api/events/:id` - Update an event (Admin only).
    *   `DELETE /api/events/:id` - Delete an event (Admin only).
*   **Bookings:**
    *   `POST /api/bookings` - Book a ticket.
    *   `GET /api/bookings` - List user's bookings.
    *   `DELETE /api/bookings/:id` - Cancel a booking.
*   **Users:**
    *   `GET /api/users` - List all users (Admin only).
    *   `DELETE /api/users/:id` - Delete a user (Admin only).
*   **Password Reset:**
    *   `POST /api/auth/forgot-password` - Initiate password reset.
    *   `POST /api/auth/reset-password/:token` - Complete password reset.
---
## Frontend Routes
The React frontend includes the following routes:
*   `/` - Home page displaying events.
*   `/login` - User login page.
*   `/register` - User registration page.
*   `/events/:id` - Event details page.
*   `/bookings` - User's booked tickets page.
*   `/admin` - Admin dashboard (restricted access).
*   `/admin/events` - Admin event management page.
*   `/admin/users` - Admin user management page.
*   `/reset-password/:token` - Password reset page.
---
## Usage
1.  **Start the backend server:**
    ```bash
    cd backend
    npm start
    ```
2.  **Start the frontend development server:**
    ```bash
    cd ../frontend
    npm run start
    ```
3.  **Access the application:**







        
   

