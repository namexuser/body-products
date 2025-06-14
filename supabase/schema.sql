-- Create the products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    msrp DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    image_url_front VARCHAR(255),
    image_url_back VARCHAR(255),
    product_type VARCHAR(255),
    size VARCHAR(255),
    scent TEXT,
    ingredients TEXT[],
    available_units INTEGER NOT NULL DEFAULT 0 CHECK (available_units >= 0)
);

-- Create the inventory table
CREATE TABLE inventory (
    product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    quantity_in_stock INTEGER NOT NULL DEFAULT 0 CHECK (quantity_in_stock >= 0)
);

-- Create the customers table (optional, depending on how customer info is handled)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT
);

-- Create the orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL, -- Optional link to customers table
    customer_name VARCHAR(255),
    customer_email VARCHAR(255) NOT NULL,
    customer_city VARCHAR(255),
    customer_phone VARCHAR(255),
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' -- e.g., 'pending', 'processing', 'completed', 'cancelled'
);

-- Create the order_items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL, -- Keep item even if product is deleted
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_purchase DECIMAL(10, 2) NOT NULL -- Store price at time of purchase
);

-- Create the contact_submissions table
CREATE TABLE contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable the uuid-ossp extension for uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";