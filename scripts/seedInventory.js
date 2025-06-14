// Script to seed the Supabase database with inventory data from a JSON file

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath
import { dirname } from 'path'; // Import dirname
import dotenv from 'dotenv'; // Import dotenv

// Load environment variables from .env file
dotenv.config();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Supabase client
// Ensure your environment variables are set correctly
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Path to the parsed inventory JSON file
const inventoryJsonPath = path.resolve(__dirname, '../public/product-images/InventoryJSON.txt');
const imageDirectory = path.resolve(__dirname, '../public/product-images');

async function seedInventory() {
    console.log('Starting inventory data seeding...');

    try {
        // Read and parse the inventory JSON data
        const inventoryJsonContent = fs.readFileSync(inventoryJsonPath, 'utf8');
        const productsData = JSON.parse(inventoryJsonContent);

        // Get list of available image files
        const imageFiles = fs.readdirSync(imageDirectory);
        console.log('Available image files:', imageFiles);

        const insertedSkus = new Set(); // Set to keep track of inserted SKUs

        // Process and insert data
        for (const product of productsData) {
            const {
                "PRODUCT NAME": name,
                "SIZE": size,
                "PRODUCT TYPE": type,
                "SKU": sku,
                "MSRP": msrpString,
                "FRAGRANCE NOTES": fragranceNotes,
                "INGREDIENTS": ingredients,
                "QUANTITY": quantityInStock
            } = product;

            // Skip products with missing or "TBD" SKU, MSRP, or QUANTITY
            if (!sku || sku === 'TBD' || !msrpString || msrpString === 'TBD' || quantityInStock === null || quantityInStock === undefined) {
                console.warn(`Skipping product due to missing/TBD data: ${name || 'Unknown Product'}`);
                continue;
            }

            // Skip if SKU has already been inserted
            if (insertedSkus.has(sku)) {
                console.warn(`Skipping duplicate product with SKU: ${sku}`);
                continue;
            }

            // Clean up MSRP string and convert to number
            const price = parseFloat(msrpString.replace('$', ''));

            // Determine image URL based on SKU
            let imageUrl = null;
            const baseImageName = `${sku}`;
            const imageExtensions = ['.png', '.jpg', '.jpeg']; // Common image extensions

            for (const ext of imageExtensions) {
                const frontImage = `${baseImageName}${ext}`;
                if (imageFiles.includes(frontImage)) {
                    imageUrl = `/product-images/${frontImage}`;
                    break; // Found the primary image, no need to check others
                }
            }

            // If no primary image found, check for back view image
            if (!imageUrl) {
                 for (const ext of imageExtensions) {
                    const backImage = `${baseImageName}-B${ext}`;
                    if (imageFiles.includes(backImage)) {
                        imageUrl = `/product-images/${backImage}`;
                        break; // Found a back view image
                    }
                }
            }

            // Insert into products table
            const { data: productData, error: productError } = await supabase
                .from('products')
                .insert([{
                    name: `${name} - ${size} (${type})`, // Combine name, size, and type for clarity
                    description: `Fragrance Notes: ${fragranceNotes}\nIngredients: ${ingredients}`, // Combine fragrance notes and ingredients
                    price: price,
                    image_url: imageUrl,
                    // Add other relevant fields if needed, e.g., sku
                    sku: sku // Add SKU to products table for easier lookup
                }])
                .select(); // Select the inserted data to get the ID

            if (productError) {
                console.error('Error inserting product:', name, productError);
                continue; // Skip to the next product
            }

            const productId = productData[0].id;

            // Insert into inventory table
            const { data: inventoryData, error: inventoryError } = await supabase
                .from('inventory')
                .insert([{
                    product_id: productId,
                    quantity_in_stock: quantityInStock
                }]);

            if (inventoryError) {
                console.error('Error inserting inventory for product:', name, inventoryError);
            } else {
                console.log('Successfully inserted product and inventory for:', name);
                insertedSkus.add(sku); // Add SKU to the set after successful insertion
            }
        }

        console.log('Inventory data seeding completed.');

    } catch (error) {
        console.error('An error occurred during inventory seeding:', error);
    }
}

seedInventory(); // Uncomment to run the function