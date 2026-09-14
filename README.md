# Inventory & Order API

A comprehensive backend REST API built with Node.js, Express.js, and PostgreSQL for managing products and creating orders. The API features secure JWT authentication, stock validation, and race-condition handling.

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and update the PostgreSQL connection details (`DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `DB_HOST`). Make sure PostgreSQL is running locally.
4. **Run the application**:
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000`. Database tables will automatically sync on the first run.

---

## API Documentation

### 1. User Authentication

**Register a new user**
- **Endpoint:** `POST /api/auth/register`
- **Access:** Public
- **Body:**
  ```json
  {
      "name": "Ashmit",
      "email": "ashmit@test.com",
      "password": "password123"
  }
  ```

**Login User**
- **Endpoint:** `POST /api/auth/login`
- **Access:** Public
- **Body:**
  ```json
  {
      "email": "ashmit@test.com",
      "password": "password123"
  }
  ```
> **Note:** The login response will return a JWT `token`. Pass this token as a `Bearer Token` in the Authorization header for all protected routes below.

---

### 2. Products APIs

**Add a Product**
- **Endpoint:** `POST /api/products`
- **Access:** Private (Requires Token)
- **Body:**
  ```json
  {
      "name": "Gaming Laptop",
      "description": "High end gaming laptop",
      "price": 85000.00,
      "stock_quantity": 10,
      "category": "electronics"
  }
  ```

**Get All Products (with Search, Filter & Pagination)**
- **Endpoint:** `GET /api/products`
- **Access:** Public
- **Query Parameters Example:** `?category=electronics&inStock=true&search=laptop&page=1&limit=5`
  - `category`: Filter by category
  - `inStock`: `true` or `false`
  - `search`: Search by product name
  - `page` & `limit`: For pagination

**Get a Single Product**
- **Endpoint:** `GET /api/products/:id`
- **Access:** Public

**Update a Product**
- **Endpoint:** `PATCH /api/products/:id`
- **Access:** Private (Requires Token)
- **Body:**
  ```json
  {
      "price": 82000.00
  }
  ```

**Delete a Product**
- **Endpoint:** `DELETE /api/products/:id`
- **Access:** Private (Requires Token)

---

### 3. Orders APIs

**Create an Order**
- **Endpoint:** `POST /api/orders`
- **Access:** Private (Requires Token)
- **Body:**
  ```json
  {
      "items": [
          {
              "productId": "your_product_id_here",
              "quantity": 2
          }
      ]
  }
  ```
> *Stock is automatically deducted when an order is created successfully.*

**Get Logged-in User's Orders**
- **Endpoint:** `GET /api/orders`
- **Access:** Private (Requires Token)

**Get a Single Order**
- **Endpoint:** `GET /api/orders/:id`
- **Access:** Private (Requires Token)

---

## Question: Handling Race Conditions (Concurrency)
**Q**: Imagine two users try to buy the last available item at the same time. How would you make sure the stock does not become negative or both orders get confirmed?

**Answer**: 
To prevent negative stock or overselling, I implemented database transactions with row-level locking. Specifically, I use the `SELECT ... FOR UPDATE` lock (via Sequelize's `lock: transaction.LOCK.UPDATE`) when checking a product's available stock during order creation. 
This locks the selected product row until the transaction commits or rolls back, ensuring that concurrent requests for the same product are executed sequentially, thus preventing race conditions. 

---

## AI Usage
- **Tools Used**: ChatGPT, Claude AI.
- **Purpose**: Used for scaffolding the project structure, generating Sequelize models, structuring basic Express routing with validations, and implementing the error-handling middleware.
