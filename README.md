# Inventory & Order API

A simple backend API built with Node.js, Express.js, and PostgreSQL for managing products and creating orders.

## Setup Instructions

1. **Clone the repository** (if applicable) or download the source code.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and update the PostgreSQL connection details (`DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `DB_HOST`). Make sure PostgreSQL is running on your machine.
4. **Run the application**:
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000` (or the PORT defined in `.env`). Database tables will automatically sync.

## Question: Handling Race Conditions (Concurrency)
**Q**: Imagine two users try to buy the last available item at the same time. How would you make sure the stock does not become negative or both orders get confirmed?

**Answer**: 
To prevent negative stock or overselling, I implemented database transactions with row-level locking. Specifically, I use the `SELECT ... FOR UPDATE` lock (via Sequelize's `lock: transaction.LOCK.UPDATE`) when checking a product's available stock during order creation. 
This locks the selected product row until the transaction commits or rolls back, ensuring that concurrent requests for the same product are executed sequentially, thus preventing race conditions. 

## AI Usage
- **Tools Used**: Antigravity Assistant (AI Coding Agent).
- **Purpose**: I used the AI to scaffold the project structure, generate Sequelize models, set up basic Express routing with validations, and structure the error-handling middleware based on the provided PDF instructions.
