# 🚀 FinanceTracker: Intelligent Personal Finance Management

An enterprise-grade, full-stack web application designed to track financial telemetry, enforce budget constraints, and provide machine learning-driven forecasting. Built with a decoupled architecture featuring a RESTful Python backend and a responsive, glassmorphism React frontend.

---

## 📑 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Architecture & Tech Stack](#-architecture--tech-stack)
4. [Machine Learning Integration](#-machine-learning-integration)
5. [Installation & Setup](#-installation--setup)
6. [API Reference](#-api-reference)
7. [Future Roadmap](#-future-roadmap)

---

## 🎯 Project Overview
FinanceTracker goes beyond traditional ledger applications. It is engineered to act as a proactive financial assistant. By combining a sleek, mobile-first user interface with predictive Python algorithms, the system not only records historical transaction data but accurately projects future spending velocity. 

This project demonstrates strong capabilities in full-stack integration, secure authentication, relational database management, and mathematical data modeling.

---

## ✨ Key Features
* **Glassmorphism UI:** A premium, dark-mode aesthetic utilizing deep gradients, backdrop blurs, and neon accents. Fully responsive across desktop, tablet, and mobile touchscreens.
* **JWT Authentication:** Secure, token-based user login and registration flows.
* **Dynamic Budgeting:** Users can set monthly constraints per category. The system calculates real-time consumption and visually warns users as they approach their limits.
* **AI Spending Forecast:** Analyzes daily transaction velocity using linear regression to predict end-of-month spending.
* **Data Export:** Instantly compile and download historical financial data into formatted `.CSV` or `.PDF` reports.
* **Interactive Data Visualization:** Rendered using Recharts for fluid, responsive expense breakdowns.

---

## 🛠 Architecture & Tech Stack

### Frontend (Client-Side)
* **Framework:** React.js
* **Routing:** React Router DOM
* **Styling:** Bootstrap 5 (Customized), CSS3 (Glassmorphism)
* **Data Visualization:** Recharts
* **Document Generation:** jsPDF, jsPDF-AutoTable
* **State Management:** React Hooks (`useState`, `useEffect`)

### Backend (Server-Side)
* **Framework:** Django, Python
* **API Architecture:** Django REST Framework (DRF)
* **Authentication:** SimpleJWT (JSON Web Tokens)
* **Database:** SQLite (Development) / PostgreSQL (Ready for Production)
* **Cross-Origin Resource Sharing:** Django CORS Headers

---

## 🧠 Machine Learning Integration
The backend utilizes a custom Python-based **Linear Regression Algorithm** to calculate projected spending. 
Rather than relying on heavy external data science libraries, the engine mathematically computes the slope ($m$) and intercept ($b$) of the user's daily cumulative spending, projecting the line of best fit out to the final day of the current calendar month.

---

## ⚙️ Installation & Setup

### Prerequisites
* Python 3.10+
* Node.js v16+
* Git

### Backend Setup
1. Clone the repository and navigate to the backend directory.
2. Create and activate a virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows use `env\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations and start the server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory.
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```

---

## 📡 API Reference

| Endpoint | Method | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `/api/token/` | `POST` | Obtain JWT access and refresh tokens. | None |
| `/api/register/` | `POST` | Register a new user identity. | None |
| `/api/dashboard/` | `GET` | Retrieve aggregate totals and AI forecast. | Required |
| `/api/transactions/` | `GET`, `POST` | Fetch or create transaction records. | Required |
| `/api/transactions/<id>/` | `DELETE` | Remove a specific transaction. | Required |
| `/api/budgets/` | `GET`, `POST` | Manage monthly budget constraints. | Required |

---

## 🚀 Future Roadmap
The architecture is designed to scale. Upcoming features currently in development include:
1. **Smart Receipt Scanner (OCR):** Integrating Tesseract Optical Character Recognition to extract total amounts directly from uploaded receipt images, eliminating manual data entry.
2. **Automated Categorization:** Natural Language Processing (NLP) to auto-tag transactions based on description keywords.
3. **Multi-Currency Support:** Real-time exchange rate API integration for international travelers.