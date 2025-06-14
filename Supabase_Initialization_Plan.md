# Supabase Initialization and Integration Plan

This plan outlines the steps to initialize the Supabase database for project ID `vkihanppapmxinlwcihx`, define and apply the schema, integrate inventory data, implement purchase order and contact form functionality, and confirm environment variable configuration.

**Detailed Plan (Revised for Supabase Dashboard):**

1.  **Database Schema Design:**
    *   Define the structure for the following tables:
        *   `products`: Stores product details (ID, name, description, price, image\_url).
        *   `inventory`: Stores inventory levels, linked to products (product\_id, quantity\_in\_stock).
        *   `customers`: Stores customer information (ID, name, email, address). This might be optional if customer info is stored directly on the order.
        *   `orders`: Stores order details (ID, customer\_id (optional FK), customer\_name, customer\_email, customer\_address, order\_date, total\_amount, status).
        *   `order_items`: Stores individual items within an order, linked to orders and products (ID, order\_id (FK), product\_id (FK), quantity, price\_at\_purchase).
        *   `contact_submissions`: Stores contact form submissions (ID, name, email, subject, message, submission\_date).
    *   Determine appropriate data types, primary and foreign keys, constraints, and indexes for each table.

2.  **Supabase Database Initialization and Schema Creation (Manual via Dashboard):**
    *   Access the Supabase dashboard for project ID `vkihanppapmxinlwcihx`.
    *   Manually create the tables (`products`, `inventory`, `customers`, `orders`, `order_items`, `contact_submissions`) using the Table Editor in the Supabase dashboard.
    *   Define the columns, data types, primary keys, and foreign key relationships as designed in Step 1.
    *   Set up any necessary RLS (Row Level Security) policies for the tables to control access.

3.  **Inventory Data Extraction and Seeding:**
    *   Develop a script (likely in Node.js using libraries for DOCX/PDF parsing) to read data from `@/public/product-images/Inventory Table (1).docx` and `@/public/product-images/Inventory Table (1).pdf`.
    *   Extract product names, descriptions, prices, and inventory quantities from these documents.
    *   Map the extracted product data to the corresponding image files in the `@/public/product-images` directory.
    *   Write a script to insert the extracted and mapped data into the `products` and `inventory` tables in the Supabase database. This script will need to use the Supabase client library to interact with the database.

4.  **Implement Purchase Order Functionality:**
    *   Create a Supabase Edge Function or a backend endpoint to handle the purchase order process.
    *   This function/endpoint will:
        *   Receive customer details and the list of items in the order.
        *   Create new records in the `orders` and `order_items` tables using the Supabase client library.
        *   Calculate the total cost of the order.
        *   Generate the content for the purchase order email (e.g., an HTML template or plain text summary).
        *   Utilize the Resend API (using the `RESEND_API_KEY` from the environment variables) to send the generated purchase order email to both the customer's provided email address and the client's email address (`012009@gmail.com`).

5.  **Implement Contact Form Submission Functionality:**
    *   Create a Supabase Edge Function or a backend endpoint to handle contact form submissions.
    *   This function/endpoint will:
        *   Receive the name, email, subject, and message from the contact form.
        *   Store the submission in the `contact_submissions` table using the Supabase client library.
        *   Utilize the Resend API to send an email containing the submission details to the client's email address (`012009@gmail.com`).

6.  **Environment Variable Confirmation:**
    *   Confirm that the `.env` file already contains the correct `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `RESEND_API_KEY` as provided in the task description. No changes are needed for the environment variables themselves.

**Database Schema Visualization (Mermaid Diagram):**

```mermaid
erDiagram
    products {
        uuid id PK
        varchar name
        text description
        decimal price
        varchar image_url
    }
    inventory {
        uuid product_id PK FK
        integer quantity_in_stock
    }
    customers {
        uuid id PK
        varchar name
        varchar email
        text address
    }
    orders {
        uuid id PK
        uuid customer_id FK "optional"
        varchar customer_name
        varchar customer_email
        text customer_address
        timestamp order_date
        decimal total_amount
        varchar status
    }
    order_items {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        integer quantity
        decimal price_at_purchase
    }
    contact_submissions {
        uuid id PK
        varchar name
        varchar email
        varchar subject
        text message
        timestamp submission_date
    }

    products ||--o{ inventory : has
    customers ||--o{ orders : places
    orders ||--o{ order_items : contains
    products ||--o{ order_items : included_as