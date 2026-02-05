# Event Management

## Login Details
- email - kannan11071985@gmail.com
- password - password123

## Table of Contents
- [About The Project](#about-the-project)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Frontend Routes](#frontend-routes)
- [Usage](#usage)
- [Email Functionality](#email-functionality)
- [Stripe Integration](#stripe-integration)
- [Admin Access](#admin-access)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

---

## About The Project

**Event Management** is a full-stack event management application built using the **MERN stack**  
(MongoDB, Express.js, React.js, Node.js) and styled with **Tailwind CSS**.

This platform allows users to:
- Browse events
- Book tickets securely
- Receive email notifications

Admins can manage:
- Events
- Users
- Bookings

---

## Features

- **User Authentication**
  - Secure registration and login using JWT

- **Event Browsing**
  - View available events with details

- **Ticket Booking**
  - Select ticket quantity
  - Secure Stripe payment integration
  - View booking history

- **User Profile**
  - View booked tickets

- **Admin Dashboard (Restricted)**
  - User management
  - Event CRUD operations

- **Email Notifications**
  - Welcome emails
  - Booking confirmations
  - Password reset (if enabled)

- **File Uploads**
  - Event image uploads using Multer

- **Responsive UI**
  - Built with Tailwind CSS

---

## Technologies Used

### Frontend
- React.js
- Tailwind CSS
- React Router DOM
- Axios
- @stripe/react-stripe-js

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- Bcrypt.js
- Multer
- Nodemailer
- Stripe
- Dotenv
- CORS

### Database
- MongoDB (Local or MongoDB Atlas)

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (LTS)
- npm
- MongoDB (local or Atlas)
- Git

---

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kannan1107/eventUI.git


cd backend
npm install

cd ../frontend
npm install


---

 👍
