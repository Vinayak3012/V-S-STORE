# 🛒 V-S-STORE

A full-featured e-commerce web application built with **Node.js**, **Express**, and **EJS** — supporting product listings, user authentication, image uploads, background job processing, and transactional email delivery.

Live - https://v-s-store-qdtx.onrender.com/

---

## 🚀 Features

- 🛍️ Product browsing and store management
- 👤 User authentication and session handling
- 🖼️ Image upload and management via **Cloudinary**
- 📧 Transactional email notifications using background tasks
- ⚡ Asynchronous job processing with **BullMQ** (Redis-backed queues)
- 🔐 Input validation using custom schema definitions
- 🧩 MVC architecture for clean code separation

---

## 🗂️ Project Structure

```
V-S-STORE/
├── controllers/        # Route handler logic (business logic layer)
├── models/             # Mongoose/data models
├── public/             # Static assets (CSS, JS, images)
├── routes/             # Express route definitions
├── utils/              # Utility/helper functions
├── views/              # EJS templates (server-side rendered UI)
├── app.js              # Express app setup and entry point
├── middleware.js        # Custom middleware (auth, error handling, etc.)
├── schema.js           # Joi/validation schemas
├── cloudinary.js       # Cloudinary configuration
├── bullmq.js           # BullMQ worker setup
├── Queue_bullMQ.js     # Job queue definitions
├── emailTasks.js       # Email job processors
└── simple_tasks.js     # Other background task processors
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Templating | EJS |
| Styling | CSS |
| Image Hosting | Cloudinary |
| Job Queues | BullMQ |
| Queue Backend | Redis |
| Email | Nodemailer (or similar) |

---

## ⚙️ Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v16+
- [npm](https://www.npmjs.com/)
- [Redis](https://redis.io/) (required for BullMQ job queues)
- A [Cloudinary](https://cloudinary.com/) account

---

## 📦 Installation

```bash
# 1. Clone the repository
git clone https://github.com/Vinayak3012/V-S-STORE.git
cd V-S-STORE

# 2. Install dependencies
npm install

# 3. Set up environment variables (see below)
cp .env.example .env

# 4. Start the server
node app.js
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory and configure the following:

```env
# Server
PORT=3000
SESSION_SECRET=your_session_secret

# MongoDB
MONGO_URI=your_mongodb_connection_string

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis (for BullMQ)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Email
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

---

## 🏃 Running the App

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Make sure your Redis server is running before starting the app, as BullMQ depends on it for job queues.

---

## 📬 Background Jobs

V-S-STORE uses **BullMQ** to handle async workloads:

- **Email Jobs** — Order confirmations, welcome emails, and notifications are queued and processed via `emailTasks.js`
- **General Tasks** — Other background operations are handled via `simple_tasks.js`

The queue is initialized in `Queue_bullMQ.js` and workers are configured in `bullmq.js`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source. Feel free to use and adapt it.

---

## 👤 Author

**Vinayak3012**
- GitHub: [@Vinayak3012](https://github.com/Vinayak3012)
