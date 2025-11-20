# Hotel Billing System - Backend API Documentation

## Overview
Production-ready REST API for hotel/restaurant billing and management system built with Spring Boot 3.2.0, PostgreSQL, and JWT authentication.

## Technology Stack
- **Java 17**
- **Spring Boot 3.2.0** (Web, Data JPA, Security)
- **PostgreSQL** for database
- **JWT** for authentication
- **Lombok** for boilerplate reduction
- **ZXing** for QR code generation
- **iText** for PDF generation (future use)

## Getting Started

### Prerequisites
- Java 17 or higher
- PostgreSQL 14 or higher
- Maven 3.8+

### Database Setup
```sql
CREATE DATABASE hotel_billing;
```

### Configuration
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/hotel_billing
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Running the Application
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The API will be available at: `http://localhost:8080`

## Default Users
The application creates these default users on first run:

| Username | Password | Role | Use Case |
|----------|----------|------|----------|
| admin | admin123 | ADMIN | Full system access |
| servant | servant123 | SERVANT | Order taking, bill generation |
| kitchen | kitchen123 | KITCHEN | Kitchen display only |
| cashier | cashier123 | CASHIER | Payment processing |

## API Endpoints

### Authentication
**POST** `/api/auth/register` - Register new user (Admin only)
```json
{
  "username": "string",
  "password": "string",
  "fullName": "string",
  "phone": "string",
  "role": "ADMIN|SERVANT|KITCHEN|CASHIER"
}
```

**POST** `/api/auth/login` - Login
```json
{
  "username": "string",
  "password": "string"
}
```
Response:
```json
{
  "token": "jwt_token",
  "username": "string",
  "fullName": "string",
  "role": "string",
  "userId": 1
}
```

**GET** `/api/auth/me` - Get current user info (requires authentication)

### Categories
**GET** `/api/categories` - Get all categories
**GET** `/api/categories/active` - Get active categories
**GET** `/api/categories/{id}` - Get category by ID
**POST** `/api/categories` - Create category (Admin only)
**PUT** `/api/categories/{id}` - Update category (Admin only)
**DELETE** `/api/categories/{id}` - Delete category (Admin only)
**PATCH** `/api/categories/{id}/toggle` - Toggle active status (Admin only)

### Menu Items
**GET** `/api/menu` - Get all menu items
**GET** `/api/menu/available` - Get available menu items
**GET** `/api/menu/category/{categoryId}` - Get items by category
**GET** `/api/menu/{id}` - Get menu item by ID
**POST** `/api/menu` - Create menu item (Admin only)
**PUT** `/api/menu/{id}` - Update menu item (Admin only)
**DELETE** `/api/menu/{id}` - Delete menu item (Admin only)
**PATCH** `/api/menu/{id}/toggle` - Toggle availability (Admin only)

### Tables
**GET** `/api/tables` - Get all tables
**GET** `/api/tables/status/{status}` - Get tables by status (FREE, OCCUPIED, RESERVED)
**GET** `/api/tables/{id}` - Get table by ID
**POST** `/api/tables` - Create table (Admin only)
**PUT** `/api/tables/{id}` - Update table (Admin only)
**DELETE** `/api/tables/{id}` - Delete table (Admin only)
**PATCH** `/api/tables/{id}/status` - Update table status

### Orders
**GET** `/api/orders` - Get all orders
**GET** `/api/orders/active` - Get active orders
**GET** `/api/orders/status/{status}` - Get orders by status
**GET** `/api/orders/{id}` - Get order by ID
**GET** `/api/orders/number/{orderNumber}` - Get order by number

**POST** `/api/orders` - Create new order
```json
{
  "tableId": 1,
  "orderType": "DINE_IN|PARCEL|TAKEAWAY",
  "items": [
    {
      "menuItemId": 1,
      "quantity": 2,
      "specialNotes": "Less spicy"
    }
  ],
  "specialInstructions": "Extra napkins"
}
```

**PUT** `/api/orders/{id}` - Update order (before sent to kitchen)
**PATCH** `/api/orders/{id}/status` - Update order status
**PATCH** `/api/orders/{id}/phone` - Add customer phone
**DELETE** `/api/orders/{id}` - Cancel order

### Kitchen Display System (KDS)
**GET** `/api/kitchen/orders` - Get all kitchen orders
**GET** `/api/kitchen/orders/pending` - Get pending orders
**GET** `/api/kitchen/orders/cooking` - Get cooking orders
**GET** `/api/kitchen/orders/ready` - Get ready orders

**PATCH** `/api/kitchen/items/{itemId}/status` - Update item status
**PATCH** `/api/kitchen/items/{itemId}/cooking` - Mark item as cooking
**PATCH** `/api/kitchen/items/{itemId}/ready` - Mark item as ready

**PATCH** `/api/kitchen/orders/{orderId}/cooking` - Start cooking entire order
**PATCH** `/api/kitchen/orders/{orderId}/ready` - Mark entire order as ready

### Bills
**GET** `/api/bills` - Get all bills
**GET** `/api/bills/{id}` - Get bill by ID
**GET** `/api/bills/number/{billNumber}` - Get bill by number
**GET** `/api/bills/order/{orderId}` - Get bill by order ID
**GET** `/api/bills/phone/{phone}` - Get bills by customer phone
**GET** `/api/bills/status/{status}` - Get bills by payment status

**POST** `/api/bills` - Create bill from order
```json
{
  "orderId": 1,
  "customerPhone": "1234567890",
  "taxPercentage": 5.0,
  "discountPercentage": 10.0,
  "discountAmount": 50.0
}
```

**PUT** `/api/bills/{id}` - Update bill (before payment)

### Invoice (Public Access)
**GET** `/api/invoice/{qrToken}` - Get invoice by QR token (no auth required)

This endpoint is used when customers scan the QR code to view their invoice.

### Payments
**GET** `/api/payments` - Get all payments (Admin/Cashier)
**GET** `/api/payments/{id}` - Get payment by ID
**GET** `/api/payments/bill/{billId}` - Get payments for a bill
**GET** `/api/payments/bill/{billId}/total` - Get total paid amount

**POST** `/api/payments` - Process payment
```json
{
  "billId": 1,
  "paymentMethod": "CASH|UPI|CARD|WALLET|CREDIT",
  "amount": 500.00,
  "transactionReference": "TXN123456",
  "notes": "Paid via Google Pay"
}
```

## Workflow

### Complete Order-to-Payment Flow

1. **Servant Login**
   - POST `/api/auth/login` with servant credentials

2. **View Tables & Menu**
   - GET `/api/tables` to see available tables
   - GET `/api/menu/available` to see menu items

3. **Create Order**
   - POST `/api/orders` with table, items, and notes
   - Table status auto-updates to OCCUPIED

4. **Kitchen Receives Order**
   - Kitchen staff logs in
   - GET `/api/kitchen/orders/pending` shows new orders
   - PATCH `/api/kitchen/orders/{id}/cooking` to start preparing
   - PATCH `/api/kitchen/items/{itemId}/ready` for each completed item
   - Order auto-updates to READY when all items ready

5. **Servant Serves Food**
   - GET `/api/orders/status/READY` to see ready orders
   - Serve food to customer
   - PATCH `/api/orders/{id}/status` with status=SERVED

6. **Generate Bill**
   - Ask customer for phone number
   - PATCH `/api/orders/{id}/phone` to add phone
   - POST `/api/bills` to generate bill with QR code
   - System returns bill with QR code and invoice URL

7. **Customer Views Invoice**
   - Customer scans QR code or opens invoice URL
   - GET `/api/invoice/{qrToken}` shows full bill details

8. **Cashier Processes Payment**
   - Customer comes to cashier
   - Cashier scans QR code or searches by phone/bill number
   - GET `/api/bills/phone/{phone}` or scan to get bill
   - POST `/api/payments` to record payment(s)
   - System auto-updates payment status (PARTIAL/PAID)
   - Table status auto-updates to FREE when fully paid

## Security
- All endpoints except `/api/auth/login`, `/api/auth/register`, and `/api/invoice/**` require JWT authentication
- JWT token expires after 24 hours (configurable)
- Passwords are encrypted using BCrypt
- Role-based access control enforced at endpoint level

## Error Responses
All errors follow this format:
```json
{
  "timestamp": "2024-01-01T10:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Detailed error message"
}
```

## Status Codes
- `200 OK` - Successful GET/PUT/PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Validation error or business logic violation
- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Database Schema
See `DATABASE_SCHEMA.md` for complete database design and relationships.

## Future Enhancements (Phase 2)
- Daily/monthly sales reports
- Inventory management
- Expense tracking
- Top-selling items analytics
- WhatsApp/SMS integration for invoices
- PDF invoice generation
- Multi-language support
