# Kargo - Inventory & Order Management System

Kargo is a full-stack Inventory & Order Management System developed as part of a technical assessment. The application enables businesses to manage products, customers, inventory levels, and customer orders while enforcing real-world inventory constraints and business rules.

---

## Live Demo

### Frontend

https://inventory-management-flame-pi.vercel.app

### Backend API

https://inventory-management-cegq.onrender.com

### Swagger Documentation

https://inventory-management-cegq.onrender.com/docs

---

## Project Overview

The system provides:

* Product inventory management
* Customer management
* Order management
* Automatic stock tracking
* Dashboard analytics
* Low-stock monitoring
* Responsive user interface
* RESTful API architecture

The application is fully containerized using Docker and deployed using modern cloud platforms.

---

## Technology Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Axios
* React Router
* React Hook Form

### Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic

### Database

* PostgreSQL

### DevOps

* Docker
* Docker Compose
* GitHub
* Render
* Vercel
* Supabase

---

## Business Rules Implemented

The following assessment requirements are enforced:

### Products

* Product SKU must be unique.
* Product quantity cannot be negative.

### Customers

* Customer email must be unique.

### Orders

* Orders cannot be created when inventory is insufficient.
* Inventory is automatically reduced when an order is placed.
* Inventory is restored when an order is cancelled.
* Order totals are calculated automatically by the backend.
* Product prices are snapshotted at order creation time.

### APIs

* Proper validation and error handling implemented.
* Consistent JSON responses.
* Appropriate HTTP status codes returned.

---

## System Architecture

```text
React Frontend
      │
      ▼
FastAPI Backend
      │
      ▼
PostgreSQL Database
```

---

## Database Design

### Product

| Field    | Type    |
| -------- | ------- |
| id       | Integer |
| name     | String  |
| sku      | String  |
| price    | Decimal |
| quantity | Integer |

### Customer

| Field | Type    |
| ----- | ------- |
| id    | Integer |
| name  | String  |
| email | String  |

### Order

| Field        | Type     |
| ------------ | -------- |
| id           | Integer  |
| customer_id  | Integer  |
| total_amount | Decimal  |
| created_at   | DateTime |

### OrderItem

| Field               | Type    |
| ------------------- | ------- |
| id                  | Integer |
| order_id            | Integer |
| product_id          | Integer |
| quantity            | Integer |
| unit_price_snapshot | Decimal |

---

## Features

### Dashboard

* Product count
* Customer count
* Order count
* Revenue summary
* Low-stock alerts

### Product Management

* Create products
* Update products
* Delete products
* Inventory tracking

### Customer Management

* Create customers
* View customers
* Delete customers

### Order Management

* Create orders
* View order history
* View order details
* Cancel orders

---

## Local Setup

### Prerequisites

* Docker Desktop
* Git

### Clone Repository

```bash
git clone https://github.com/Devansh0908/Inventory-Management.git

cd Inventory-Management
```

### Configure Environment

```bash
cp .env.example .env
```

### Start Application

```bash
docker compose up --build
```

### Local URLs

| Service               | URL                        |
| --------------------- | -------------------------- |
| Frontend              | http://localhost:3001      |
| Backend API           | http://localhost:8001      |
| Swagger Documentation | http://localhost:8001/docs |

---

## API Endpoints

### Dashboard

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | /api/dashboard/stats |

### Products

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/products      |
| GET    | /api/products      |
| GET    | /api/products/{id} |
| PUT    | /api/products/{id} |
| DELETE | /api/products/{id} |

### Customers

| Method | Endpoint            |
| ------ | ------------------- |
| POST   | /api/customers      |
| GET    | /api/customers      |
| GET    | /api/customers/{id} |
| DELETE | /api/customers/{id} |

### Orders

| Method | Endpoint         |
| ------ | ---------------- |
| POST   | /api/orders      |
| GET    | /api/orders      |
| GET    | /api/orders/{id} |
| DELETE | /api/orders/{id} |

---

## Deployment

| Component          | Platform   |
| ------------------ | ---------- |
| Frontend           | Vercel     |
| Backend            | Render     |
| Database           | Supabase   |
| Container Registry | Docker Hub |

---

## Engineering Highlights

* Built a full-stack application using React and FastAPI.
* Implemented transactional inventory management.
* Enforced business rules and data validation.
* Integrated PostgreSQL using SQLAlchemy ORM.
* Containerized the entire application using Docker and Docker Compose.
* Deployed production services using Render, Vercel, and Supabase.
* Developed a responsive and modern user interface using Tailwind CSS.
* Implemented RESTful APIs with structured error handling.

---

## Author

**Devansh Pandey**

GitHub: https://github.com/Devansh0908