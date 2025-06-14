# Product Catalog Repopulation Plan

**Objective:** Repopulate the `products` and `inventory` tables correctly based on `InventoryJSON.txt` and ensure the [`ProductCatalog.tsx`](src/components/ProductCatalog.tsx) component displays the data accurately.

**Current State:**
*   The `products` table contains `available_units` and `image_url` columns which are redundant given the current frontend implementation and the existence of the `inventory` table.
*   The `inventory` table stores the quantity in stock.
*   The `InventoryJSON.txt` file contains the source data for products and their initial quantities.
*   The [`ProductCatalog.tsx`](src/components/ProductCatalog.tsx) component fetches quantity by joining `products` and `inventory` and constructs image URLs based on the product SKU.

**Plan:**

1.  **Modify Database Schema:**
    *   Create a new Supabase migration to remove the `available_units` and `image_url` columns from the `products` table.
    *   Ensure the `sku` column remains in the `products` table as it's used by the frontend for image paths.
    *   The `inventory` table structure will remain unchanged, storing `product_id` and `quantity_in_stock`.

    ```mermaid
    erDiagram
        products {
            UUID id PK
            VARCHAR name
            TEXT description
            DECIMAL msrp
            VARCHAR product_type
            VARCHAR size
            TEXT scent
            TEXT[] ingredients
            VARCHAR sku
        }
        inventory {
            UUID product_id PK FK
            INTEGER quantity_in_stock
        }
        products ||--o{ inventory : has
    ```

2.  **Update Seeding Script (`scripts/seedInventory.js`):**
    *   Modify the script to delete all existing data from the `inventory` and `products` tables before inserting new data. This ensures a clean repopulation.
    *   Adjust the script to read the `InventoryJSON.txt` file.
    *   Iterate through the JSON data and insert into the `products` table, mapping the relevant fields (`PRODUCT NAME`, `SIZE`, `PRODUCT TYPE`, `SKU`, `MSRP`, `FRAGRANCE NOTES`, `INGREDIENTS`).
    *   Handle "Missing" or "TBD" values as specified: include all products, set MSRP to `0.00` if "Missing" or "TBD", and set Ingredients to an empty array `[]` if "Missing" or "TBD`.
    *   For each product inserted into the `products` table, get the generated `id`.
    *   Insert into the `inventory` table using the product `id` and the `QUANTITY` from the JSON data.
    *   Remove any logic related to inserting `available_units` or `image_url` into the `products` table.
    *   Keep the logic for determining image file existence based on SKU, but this will only be for logging/verification purposes in the script, as the frontend handles image URL construction.

3.  **Verify Frontend Component (`src/components/ProductCatalog.tsx`):**
    *   Confirm that the Supabase query in [`ProductCatalog.tsx`](src/components/ProductCatalog.tsx) still correctly joins the `products` and `inventory` tables to fetch the `quantity_in_stock`.
    *   Ensure the component correctly handles the data structure returned by the query, which should remain consistent for the quantity field.
    *   Confirm that the image rendering logic in the component continues to use the `product.sku` to construct image paths.

4.  **Execution:**
    *   Run the database migration to alter the `products` table.
    *   Execute the updated seeding script to populate the tables.
    *   Verify the product catalog in the frontend to ensure products are displayed correctly with accurate quantities and images.