# E-Commerce API

A full-featured e-commerce REST API built with Node.js, Express, and MongoDB. This project provides a complete backend solution for an online store with authentication, product management, shopping cart, orders, payments, and more.

## Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication
  - Passport.js strategies (JWT and Local)
  - User registration, login, and password management
  - Protected routes middleware

- 🛍️ **Product Management**
  - Categories and subcategories
  - Brands management
  - Product CRUD operations
  - Product reviews and ratings
  - Image upload and processing (Sharp)
  - Product search and filtering

- 🛒 **Shopping Features**
  - Shopping cart management
  - Wishlist functionality
  - Coupon/discount codes
  - Address management

- 💳 **Orders & Payments**
  - Order management
  - Stripe integration for payments
  - Webhook handling for payment verification

- 👥 **User Management**
  - User profiles
  - Profile image upload
  - User address management

- 🧪 **Testing**
  - Unit tests with Jest
  - End-to-end (E2E) tests
  - Code coverage reports

- 📧 **Email Services**
  - Email notifications (Nodemailer)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT, Passport.js
- **File Upload**: Multer
- **Image Processing**: Sharp
- **Payment**: Stripe
- **Email**: Nodemailer
- **Testing**: Jest, Supertest
- **Other**: Express Validator, Bcrypt, Compression, CORS

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ecommerce-project
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and configure the following environment variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
ENVIRONMENT=developement

# Database
DB_URI=mongodb://localhost:27017/ecommerce-db
# or for MongoDB Atlas:
# DB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your-jwt-secret-key

# Base URL
BASE_URL=http://localhost:5000

# Stripe
STRIPE_SECRET=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Email Configuration (Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password-or-app-password
```

4. Start the development server:
```bash
npm run start:dev
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## API Endpoints

The API is organized into the following route groups:

- `/api/v1/auth` - Authentication routes (login, register, etc.)
- `/api/v1/users` - User management routes
- `/api/v1/categories` - Category management
- `/api/v1/subcategories` - Subcategory management
- `/api/v1/brands` - Brand management
- `/api/v1/products` - Product management
- `/api/v1/reviews` - Product reviews
- `/api/v1/wishlist` - Wishlist management
- `/api/v1/addresses` - Address management
- `/api/v1/coupons` - Coupon/discount management
- `/api/v1/cart` - Shopping cart operations
- `/api/v1/orders` - Order management
- `/webhook` - Stripe webhook endpoint

## Project Structure

```
ecommerce-project/
├── config/              # Configuration files (database, etc.)
├── coverage/            # Test coverage reports
├── e2e/                 # End-to-end tests
├── middlewares/         # Custom middleware (error handling, validation, upload)
├── models/              # Mongoose models
├── routes/              # API routes
├── services/            # Business logic layer
├── strategies/          # Passport authentication strategies
├── uploads/             # Uploaded files (images)
├── utils/               # Utility functions and helpers
│   ├── validators/      # Request validation schemas
│   └── dummyData/       # Seed data
├── createApp.js         # Express app factory
├── server.js            # Application entry point
└── package.json
```

## Available Scripts

- `npm run start:dev` - Start development server with nodemon
- `npm run start:prod` - Start production server
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run end-to-end tests

## Testing

This project includes comprehensive test coverage:

- Unit tests located in `__tests__/`
- End-to-end tests in `e2e/`
- Code coverage reports generated in `coverage/`

Run tests with:
```bash
npm test
```

View coverage reports:
```bash
npm test
# Coverage reports are generated in the coverage/ directory
```

## File Uploads

The application handles file uploads for:
- User profile images (`/uploads/users/`)
- Product images (`/uploads/products/`)
- Category images (`/uploads/categories/`)
- Brand images (`/uploads/brands/`)

Uploaded files are served as static files and can be accessed via the base URL.

## Error Handling

The application includes a global error handling middleware that:
- Catches and formats errors consistently
- Provides detailed error information in development
- Returns sanitized error messages in production
- Handles async errors automatically

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Request validation with express-validator
- CORS configuration
- Secure session management
- Input sanitization

## Development

The application uses:
- **Nodemon** for automatic server restart during development
- **Morgan** for HTTP request logging (development only)
- **Compression** middleware for response compression
- **CORS** for cross-origin resource sharing

## Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Ensure all environment variables are properly configured
3. Use `npm run start:prod` to start the server
4. Consider using a process manager like PM2 for production

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Mohamed Antar
