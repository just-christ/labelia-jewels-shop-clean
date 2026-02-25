# Labélia Backend Server

Custom Node.js + Express + MySQL + Prisma backend for Labélia Jewels Shop.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Edit `.env` file with your MySQL credentials:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=labelia
JWT_SECRET=your_secret_key
```

### 3. Create Database
```bash
npm run setup:db
```

### 4. Generate Prisma Client
```bash
npm run db:generate
```

### 5. Run Database Migration
```bash
npm run db:migrate
```

### 6. Start Development Server
```bash
npm run dev
```

## Default Admin Account
- Email: `admin@labelia.fr`
- Password: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Products (Public)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Products (Admin - JWT Required)
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders (Public)
- `POST /api/orders` - Create order (Cash on Delivery)

### Orders (Admin - JWT Required)
- `GET /api/orders` - Get all orders
- `PUT /api/orders/:id/status` - Update order status

### Customers (Admin - JWT Required)
- `GET /api/customers` - Get all customers

## Payment Method
This system uses **Cash on Delivery (COD)** only. No online payment processing.

## Scripts
- `npm run dev` - Start development server with nodemon
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run setup:db` - Create database if not exists
