
# Personal Finance Tracker

## 📌 Project Overview
This project is a Personal Finance Tracker built using a React.js frontend and a Python Django REST Framework (DRF) backend[cite: 1]. It is designed to demonstrate modern Python Full Stack development capabilities, including CRUD operations, REST APIs, database integration, authentication, analytics dashboards, and report generation[cite: 1].

## 🛠️ Tech Stack
**Frontend:**
* React.js[cite: 1]
* Material UI / Bootstrap[cite: 1]
* Axios[cite: 1]
* Chart.js / Recharts (for data visualization)[cite: 1]

**Backend:**
* Python 3.x[cite: 1]
* Django & Django REST Framework (DRF)[cite: 1]
* JWT Authentication (SimpleJWT)[cite: 1]
* SQLite (Development) / PostgreSQL (Production ready)[cite: 1]
* Libraries: `reportlab`, `pandas`, `openpyxl`[cite: 1]

## ✨ Core Features
### 1. User Authentication[cite: 1]
* User Registration and Login/Logout[cite: 1].
* Secure JWT Token-based Security[cite: 1].
* Password Reset capabilities and Protected APIs[cite: 1].

### 2. Financial Dashboard[cite: 1]
* High-level metrics: Total Income, Total Expenses, and Savings Overview[cite: 1].
* Visual analytics: Monthly Spending Trends and Category-wise Expense Breakdown[cite: 1].

### 3. Transaction Management[cite: 1]
* Full CRUD Operations (Create, Read, Update, Delete) for transactions[cite: 1].
* Detailed transaction history tracking fields like amount, category, type (Income/Expense), and timestamps[cite: 1].

### 4. Budget Management[cite: 1]
* Create monthly budgets and assign them by category[cite: 1].
* Track real-time budget utilization[cite: 1].
* Automated warning alerts when spending limits are exceeded[cite: 1].

### 5. Reports & Analytics[cite: 1]
* Generate Monthly Expense Reports and Annual Financial Summaries[cite: 1].
* Export functionalities supporting PDF, CSV, and Excel formats[cite: 1].

---

## 🚀 Getting Started

### Prerequisites
* Python 3.x installed
* Node.js and npm installed
* Git

### Backend Setup
1. Navigate to the backend directory:
   `cd backend`
2. Create and activate a virtual environment:
   `python -m venv venv`
   * Windows: `venv\Scripts\activate`
   * Mac/Linux: `source venv/bin/activate`
3. Install dependencies:
   `pip install -r requirements.txt`
4. Apply database migrations:
   `python manage.py migrate`
5. Run the development server:
   `python manage.py runserver`

### Frontend Setup
1. Navigate to the frontend directory:
   `cd frontend`
2. Install dependencies:
   `npm install`
3. Start the React development server:
   `npm start`

## 🗄️ Database Schema Snapshot
* **User:** `id`, `username`, `email`, `password`[cite: 1]
* **Transaction:** `id`, `user_id`, `amount`, `category`, `transaction_type`, `description`, `date`[cite: 1]
* **Budget:** `id`, `user_id`, `category`, `monthly_limit`, `month`, `year`[cite: 1]