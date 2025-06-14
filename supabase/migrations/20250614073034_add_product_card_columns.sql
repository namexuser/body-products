ALTER TABLE products

ADD COLUMN available_units INTEGER NOT NULL DEFAULT 0 CHECK (available_units >= 0);