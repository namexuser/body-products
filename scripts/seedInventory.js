// Script to seed the Supabase database with inventory data from a JSON file

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

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
        // Delete existing data from inventory and products tables
        console.log('Deleting existing inventory data...');
        const { error: deleteInventoryError } = await supabase
            .from('inventory')
            .delete()
            .neq('product_id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

        if (deleteInventoryError) {
            console.error('Error deleting existing inventory data:', deleteInventoryError);
            return;
        }
        console.log('Existing inventory data deleted.');

        console.log('Deleting existing products data...');
        const { error: deleteProductsError } = await supabase
            .from('products')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

        if (deleteProductsError) {
            console.error('Error deleting existing products data:', deleteProductsError);
            return;
        }
        console.log('Existing products data deleted.');


        // Read and parse the inventory JSON data
        const inventoryJsonContent = fs.readFileSync(inventoryJsonPath, 'utf8');
        const productsData = JSON.parse(inventoryJsonContent);

        // Get list of available image files (for logging/verification)
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

            // Handle "Missing" or "TBD" values for SKU, MSRP, and Ingredients
            const productSku = (sku === 'Missing' || sku === 'TBD' || !sku) ? null : sku;
            const productMSRP = (msrpString === 'Missing' || msrpString === 'TBD' || !msrpString) ? 0.00 : parseFloat(msrpString.replace('$', ''));
            const productIngredients = (ingredients === 'Missing' || ingredients === 'TBD' || !ingredients) ? [] : (Array.isArray(ingredients) ? ingredients : ingredients.split(',').map(item => item.trim())); // Handle string or array ingredients

            // Determine image URL based on SKU (for insertion into image_url column)
            let imageUrl = null;
            if (productSku) {
                const baseImageName = `${productSku}`;
                const imageExtensions = ['.png', '.jpg', '.jpeg']; // Common image extensions

                for (const ext of imageExtensions) {
                    const frontImage = `${baseImageName}${ext}`;
                    if (imageFiles.includes(frontImage)) {
                        imageUrl = `/product-images/${frontImage}`;
                        break; // Found the primary image
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
            }


            // Skip products with missing or "TBD" SKU if you decide not to include them,
            // but based on the user's instruction, we will include all products.
            // We will still skip if quantity is missing or invalid.
             if (quantityInStock === null || quantityInStock === undefined) {
                console.warn(`Skipping product due to missing quantity: ${name || 'Unknown Product'}`);
                continue;
            }

            // Skip if SKU has already been inserted (only if SKU is not null)
            if (productSku && insertedSkus.has(productSku)) {
                console.warn(`Skipping duplicate product with SKU: ${productSku}`);
                continue;
            }

            // Insert into products table
            const { data: productData, error: productError } = await supabase
                .from('products')
                .insert([{
                    name: name,
                    description: `Fragrance Notes: ${fragranceNotes}`, // Store fragrance notes in description
                    price: productMSRP, // Inserting into 'price'
                    msrp: productMSRP, // Inserting into 'msrp'
                    product_type: type,
                    size: size,
                    scent: fragranceNotes, // Store fragrance notes in scent column
                    ingredients: productIngredients,
                    sku: productSku, // Insert the potentially null SKU
                    image_url: imageUrl // Insert the determined image URL
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
                if (productSku) {
                    insertedSkus.add(productSku); // Add SKU to the set after successful insertion
                }
            }
        }

        console.log('Inventory data seeding completed.');

    } catch (error) {
        console.error('An error occurred during inventory seeding:', error);
    }
}

seedInventory(); // Uncomment to run the function