# Hotel Billing System - Database Schema

## Tables and Relationships

### 1. users
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL, -- ADMIN, SERVANT, KITCHEN, CASHIER
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. categories
```sql
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. menu_items
```sql
CREATE TABLE menu_items (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    is_veg BOOLEAN DEFAULT true,
    available BOOLEAN DEFAULT true,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
```

### 4. tables
```sql
CREATE TABLE restaurant_tables (
    id BIGSERIAL PRIMARY KEY,
    table_number VARCHAR(20) UNIQUE NOT NULL,
    capacity INT NOT NULL,
    status VARCHAR(20) DEFAULT 'FREE', -- FREE, OCCUPIED, RESERVED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. orders
```sql
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    table_id BIGINT,
    order_type VARCHAR(20) NOT NULL, -- DINE_IN, PARCEL, TAKEAWAY
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, COOKING, READY, SERVED, COMPLETED, CANCELLED
    created_by BIGINT NOT NULL,
    customer_phone VARCHAR(20),
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES restaurant_tables(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### 6. order_items
```sql
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    menu_item_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    item_status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, COOKING, READY
    special_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);
```

### 7. bills
```sql
CREATE TABLE bills (
    id BIGSERIAL PRIMARY KEY,
    bill_number VARCHAR(50) UNIQUE NOT NULL,
    order_id BIGINT UNIQUE NOT NULL,
    customer_phone VARCHAR(20),
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_percentage DECIMAL(5, 2) DEFAULT 5.00,
    tax_amount DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2) DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, PARTIAL, PAID
    qr_token VARCHAR(255) UNIQUE,
    invoice_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

### 8. payments
```sql
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    bill_id BIGINT NOT NULL,
    payment_method VARCHAR(20) NOT NULL, -- CASH, UPI, CARD, WALLET, CREDIT
    amount DECIMAL(10, 2) NOT NULL,
    transaction_reference VARCHAR(100),
    processed_by BIGINT NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES users(id)
);
```

## Relationships Summary

1. **Category → MenuItem**: One-to-Many
   - One category has many menu items

2. **Table → Order**: One-to-Many
   - One table can have multiple orders over time

3. **Order → OrderItem**: One-to-Many
   - One order contains many order items

4. **MenuItem → OrderItem**: One-to-Many
   - One menu item can appear in many order items

5. **Order → Bill**: One-to-One
   - One order generates exactly one bill

6. **Bill → Payment**: One-to-Many
   - One bill can have multiple payments (split payment support)

7. **User → Order**: One-to-Many (created_by)
   - One servant creates many orders

8. **User → Payment**: One-to-Many (processed_by)
   - One cashier processes many payments

## Indexes for Performance

```sql
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_available ON menu_items(available);
CREATE INDEX idx_orders_table ON orders(table_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_by ON orders(created_by);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_status ON order_items(item_status);
CREATE INDEX idx_bills_order ON bills(order_id);
CREATE INDEX idx_bills_qr_token ON bills(qr_token);
CREATE INDEX idx_bills_payment_status ON bills(payment_status);
CREATE INDEX idx_payments_bill ON payments(bill_id);
CREATE INDEX idx_payments_processed_by ON payments(processed_by);
```

## Default Data (Seed)

### Default Admin User
```sql
INSERT INTO users (username, password, full_name, role)
VALUES ('admin', '$2a$10$...', 'System Administrator', 'ADMIN');
```

### Sample Categories
```sql
INSERT INTO categories (name, description) VALUES
('Starters', 'Appetizers and starters'),
('Main Course', 'Main dishes'),
('Beverages', 'Drinks and beverages'),
('Desserts', 'Sweet dishes');
```

### Sample Tables
```sql
INSERT INTO restaurant_tables (table_number, capacity, status) VALUES
('T1', 4, 'FREE'),
('T2', 4, 'FREE'),
('T3', 2, 'FREE'),
('T4', 6, 'FREE'),
('T5', 2, 'FREE');
```
