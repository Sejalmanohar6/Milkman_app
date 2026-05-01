#  Milkman App

A full-stack web application for managing milk delivery subscriptions, customer orders, and delivery schedules between milkman and their customers.

---

##  Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

##  Features

-  **Customer Registration & Login**  Secure authentication for customers and milkman
-  **Subscription Management**  Subscribe/unsubscribe to daily or weekly milk delivery plans
-  **Delivery Scheduling**  Milkman can manage and update delivery schedules
-  **Order Tracking**  Customers can track their orders and delivery status
-  **Dashboard**  Role-based dashboards for customers and milkman
-  **Notifications**  Status updates for deliveries

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React (TypeScript) |
| **Backend** | Django (Python) |
| **Database** | SQLite (Dev) / PostgreSQL (Prod) |
| **API** | Django REST Framework |
| **Styling** | CSS |

---

##  Project Structure

```
Milkman_app/
 frontend-react/         # React TypeScript frontend
    src/
       components/     # Reusable UI components
       pages/          # Page-level components
       services/       # API service calls
       App.tsx
    public/
    package.json

 milkman_project/        # Django backend
    milkman/            # Core Django app
       models.py       # Database models
       views.py        # API views
       serializers.py  # DRF serializers
       urls.py         # URL routing
       admin.py
    milkman_project/
       settings.py
       urls.py
    manage.py
    requirements.txt

 README.md
```

---

##  Getting Started

### Prerequisites

- Python 3.9+
- Node.js 16+
- npm or yarn

---

### Backend Setup (Django)

```bash
# 1. Navigate to backend
cd milkman_project

# 2. Create a virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Apply migrations
python manage.py makemigrations
python manage.py migrate

# 5. Create a superuser (admin)
python manage.py createsuperuser

# 6. Run the server
python manage.py runserver
```

Backend runs at: `http://localhost:8000`

---

### Frontend Setup (React)

```bash
# 1. Navigate to frontend
cd frontend-react

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

Frontend runs at: `http://localhost:3000`

---

##  API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | User login |
| GET | `/api/products/` | List available milk products |
| POST | `/api/orders/` | Place a new order |
| GET | `/api/orders/` | Get all orders for logged-in user |
| PUT | `/api/orders/<id>/` | Update order |
| DELETE | `/api/orders/<id>/` | Cancel order |
| GET | `/api/subscriptions/` | Get user subscriptions |
| POST | `/api/subscriptions/` | Create a subscription |

---

##  Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

##  License

This project is licensed under the MIT License  see the [LICENSE](LICENSE) file for details.
