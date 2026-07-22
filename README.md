# Personal Finance Tracker

## 📌 Project Overview
This project is a Personal Finance Tracker built using a React.js frontend and a Python Django REST Framework (DRF) backend[cite: 1]. It demonstrates modern Full Stack development capabilities, including secure REST APIs, JWT authentication, and interactive data visualization[cite: 1].

## 🛠️ Tech Stack
**Frontend:**
* React.js (React Router, Hooks)[cite: 1]
* Bootstrap 5 (Responsive UI)
* Axios (API Client)[cite: 1]
* Recharts (Data Visualization)[cite: 1]

**Backend:**
* Python 3.x[cite: 1]
* Django & Django REST Framework (DRF)[cite: 1]
* JWT Authentication (SimpleJWT)[cite: 1]
* SQLite (Development)[cite: 1]
* django-cors-headers

## 🚀 Current Progress & Implemented Features

### 1. Backend API & Database Setup
* **Relational Models:** Developed `Transaction` and `Budget` models linked to Django's built-in `User` model using Foreign Keys[cite: 1].
* **RESTful ViewSets:** Implemented DRY CRUD endpoints utilizing DRF's `ModelViewSet` and automatic routing.
* **Analytics Engine:** Built a custom aggregation endpoint (`/api/dashboard/`) using Django ORM to calculate total income, expenses, net savings, and category-wise breakdowns dynamically.
* **Export APIs:** Implemented endpoints to export transaction data as CSV and PDF files using `pandas` and `reportlab`[cite: 2].

### 2. Secure Authentication
* Implemented token-based security using JSON Web Tokens (JWT)[cite: 1].
* Built secure User Registration and Login endpoints.
* Added Django's built-in password reset API workflow[cite: 2].
* Configured CORS middleware to allow secure communication between the local React dev server and the Django backend.

### 3. Frontend Interface
* **Routing:** Set up protected and public routes using `react-router-dom`.
* **Auth Flow:** Built responsive Login and Registration forms with error handling and automatic redirection.
* **Axios Interceptor:** Configured a global API service to automatically attach the JWT Bearer token to all outgoing requests.
* **Interactive Dashboard:** Designed a financial summary view featuring Bootstrap metric cards and a Recharts Pie Chart to visualize expense distributions.

---

## ⚙️ Getting Started

### Backend Setup
1. Navigate to `cd backend`
2. Activate environment: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
3. Install dependencies: `pip install -r requirements.txt`
4. Run migrations: `python manage.py migrate`
5. Start server: `python manage.py runserver`

### Frontend Setup
1. Navigate to `cd frontend`
2. Install dependencies: `npm install`
3. Start React app: `npm start`