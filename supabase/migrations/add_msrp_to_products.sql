ALTER TABLE products
ADD COLUMN msrp DECIMAL(10, 2) NOT NULL DEFAULT 0.00; -- Add the MSRP column with a default value