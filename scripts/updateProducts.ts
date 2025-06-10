import { createClient } from '@supabase/supabase-js';
import { Database } from '../src/integrations/supabase/types';
import 'dotenv/config'; // Load environment variables from .env file

const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY as string;

// Check if environment variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key are required. Make sure your .env file is configured correctly.');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

interface ProductData {
  "LOCATION": string;
  "QUANTITY": number;
  "PRODUCT NAME": string;
  "SIZE": string;
  "PRODUCT TYPE": string;
  "ITEM NUMBER": string;
  "MSRP": string;
  "FRAGRANCE": string;
  "INGREDIENTS": string;
}

const productsToUpdate: ProductData[] = [
  {
    "LOCATION": "1031LH01",
    "QUANTITY": 1200,
    "PRODUCT NAME": "TWISTED PEPPERMINT",
    "SIZE": "10 FL OZ / 295 ML",
    "PRODUCT TYPE": "BODY WASH",
    "ITEM NUMBER": "028005794",
    "MSRP": "$15.95",
    "FRAGRANCE": "Fragrance notes: cool peppermint, sugared snow, fresh balsam and vanilla buttercream.",
    "INGREDIENTS": "Water (Aqua, Eau), Cocamidopropyl Betaine, Sodium Methyl Cocoyl Taurate, Fragrance (Parfum), Sodium Lauroyl Methyl Isethionate, Sodium Lauroyl Isethionate, Oleth-10, Aloe Barbadensis Leaf Juice, Glycerin, PEG-120 Methyl Glucose Trioleate, Phenoxyethanol, Hydroxyacetophenone, Panthenol, PEG-33, Tetrasodium EDTA, PEG-8 Dimethicone, Propanediol, Polysorbate 20, PEG-14, Decylene Glycol, Caprylyl Glycol, Red 33 (CI 17200), BHT, Citric Acid, PPG-12-Buteth-16, PEG-150 Pentaerythrityl Tetrastearate, Sodium Hydroxide, PPG-26-Buteth-26, PEG-6 Caprylic/Capric Glycerides, PEG-40 Hydrogenated Castor Oil, Yellow 5 (CI 19140), Ethylhexyl Methoxycinnamate, Ext. Violet 2 (CI 60730), Butyl Methoxydibenzoylmethane, Ethylhexyl Salicylate."
  },
  {
    "LOCATION": "1031LH02",
    "QUANTITY": 1008,
    "PRODUCT NAME": "BRIGHT CHRISTMAS MORNING",
    "SIZE": "10 FL OZ / 295 ML",
    "PRODUCT TYPE": "BODY WASH",
    "ITEM NUMBER": "028007116",
    "MSRP": "$15.95",
    "FRAGRANCE": "Fragrance notes: ripe red berries, blood orange and crisp apple.",
    "INGREDIENTS": "WATER (AQUA EAU) COCAMIDOPROPYL BETAINE, SODIUM MERYL COCOYL TAURATE, FRAGRANCE (PARFUM), SODIUM LAUROYL METHYLISETHIONATE SODIUM LAUROYL ISETHIONATE, OLETH 10 ALOE BARBADENSIS LEAF JUICE, GLYCERIN, PEG-120 METHYL GLUCOSE TRIGLEATE, PHENOXYETHANOL, HYDROXYACETOPHENONE PANTHENOL, PEG-33, TETRASODIUM EDTA. PEG-8 DIMETHICONE PROPANEDIOL, POLYSORBATE 20, PEG-14. CAPRYLYL GLYCOL DECYLENE GLYCOL, BHT, CITRIC ACID, PPG-12-BUTEN PLC 15U PENTAERYTHRITYL TETRASTEARATE, SODIUM HYDROXIDE PPG 26 BUTETH-26, PEG-6 CAPRYLIC/CAPRIC GLYCERIDES, PEG-40, HYDROGENATED CASTOR OIL, ETHYLHEXYL METHOXYCINNAMATE BUTYL METHOXYDIBENZOYLMETHANE, ETHYLHEXYL SALICYLATE, LIMONENE, LINALOOL, EXT. VIOLET 2 (C) 60730)."
  },
  {
    "LOCATION": "1031LH03",
    "QUANTITY": 2688,
    "PRODUCT NAME": "VANILLA BEAN NOEL",
    "SIZE": "10 FL OZ / 295 ML",
    "PRODUCT TYPE": "BODY WASH",
    "ITEM NUMBER": "0667559299882",
    "MSRP": "$15.95",
    "FRAGRANCE": "Fragrance notes: fresh vanilla bean, warm caramel, sugar cookies, whipped cream and snow-kissed musk.",
    "INGREDIENTS": "WATER (AQUA, EAU), COCAMIDOPROPYL BETAINE, SODIUM METHYL COCOYL TAURATE, FRAGRANCE (PARFUM), SODIUM LAUROYL METHYL ISETHIONATE, SODIUM LAUROYL ISETHIONATE, OLETH-10, ALOE BARBADENSIS LEAF JUICE, GLYCERIN PEG-120 METHYL GLUCOSE TRIOLEATE, PHENOXYETHANOL, HYDROXYACETOPHENONE, PANTHENOL, PEG-33, TETRASODIUM EDTA, PEG-8 DIMETHICONE, PROPANEDIOL, POLYSORBATE 20 PEG-14, DECYLENE GLYCOL, CAPRYLYL GLYCOL, BHT, CITRIC ACID, PPG-12-BUTETH-16, PEG-150 PENTAERYTHRITYL TETRASTEARATE, SODIUM HYDROXIDE, PPG-26-BUTETH-26, PEG-6 CAPRYLIC/CAPRIC GLYCERIDES, PEG-40 HYDROGENATED CASTOR OIL, ETHYLHEXYL METHOXYCINNAMATE, ETHYLHEXYL SALICYLATE, BUTYL METHOXYDIBENZOYLMETHANE, GREEN 5 (CI 61570) YELLOW 5 (CI 19140), GREEN 3 (CI 42053), EXT: VIOLET 2 (CI 60730)."
  },
  {
    "LOCATION": "1031LH04",
    "QUANTITY": 2520,
    "PRODUCT NAME": "VANILLA BEAN NOEL",
    "SIZE": "8 FL OZ / 226 ML",
    "PRODUCT TYPE": "BODY CREAM",
    "ITEM NUMBER": "028005784",
    "MSRP": "$17.95",
    "FRAGRANCE": "Fragrance notes: fresh vanilla bean, warm caramel, sugar cookies, whipped cream and snow-kissed musk.",
    "INGREDIENTS": "WATER (AQUA, EAU), GLYCERIN, CAPRYLIC/CAPRIC TRIGLYCERIDE, ISOHEXADECANE, FRAGRANCE (PARFUM), C12-15 ALKYL BENZOATE, GLYCERYL STEARATE SE, PALMITIC ACID, DIMETHICONE, THEOBROMA CACAO (COCOA) BUTTER, BUTYROSPERMUM PARKII (SHEA) BUTTER, PHENOXYETHANOL, POLYMETHYLSILSQUIOXANE, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, AMINOMETHYL PROPANOL, PEG-100 STEARATE, CHLORPHENESIN, SODIUM DEHYDROACETATE, TOCOPHEROL, DISODIUM EDTA, ETHYLHEXYLGLYCERIN, SODIUM POLYACRYLATE, HYDROGENATED RAPESEED OIL, SODIUM HYALURONATE, ALOE BARBADENSIS LEAF JUICE, POLYISOBUTENE, POLYSORBATE 20."
  },
  {
    "LOCATION": "1031LH05",
    "QUANTITY": 1344,
    "PRODUCT NAME": "Strawberry Pound Cake",
    "SIZE": "10 FL OZ / 295 ML",
    "PRODUCT TYPE": "BODY WASH",
    "ITEM NUMBER": "028003936",
    "MSRP": "$15.95",
    "FRAGRANCE": "Fragrance notes: fresh strawberries, golden shortcake and whipped cream.",
    "INGREDIENTS": "WATER (AQUA, EAU), COCAMIDOPROPYL BETAINE, SODIUM METHYL COCOYL TAURATE, FRAGRANCE (PARFUM), SODIUM LAUROYL METHYL ISETHIONATE, SODIUM LAUROYL ISETHIONATE, OLETH-10, ALOE BARBADENSIS LEAF JUICE, GLYCERIN, PEG-120 Methyl Glucose Trioleate, Phenoxyethanol, Hydroxyacetophenone, Panthenol, PEG-33, Tetrasodium EDTA, PEG-8 Dimethicone, Propanediol, Polysorbate 20, PEG-14, Decylene Glycol, Caprylyl Glycol, PPG-12-Buteth-16, BHT, Citric Acid, PEG-150 Pentaerythrityl Tetrastearate, Sodium Hydroxide, PPG-26-Buteth-26, PEG-6 Caprylic/Capric Glycerides, PEG-40 Hydrogenated Castor Oil, Ethylhexyl Methoxycinnamate, Ethylhexyl Salicylate, Butyl Methoxydibenzoylmethane, Limonene, Red 33 (CI 17200), Yellow 5 (CI 19140)."
  },
  {
    "LOCATION": "1031LH06",
    "QUANTITY": 1260,
    "PRODUCT NAME": "Strawberry Pound Cake",
    "SIZE": "8 FL OZ / 226 ML",
    "PRODUCT TYPE": "BODY CREAM",
    "ITEM NUMBER": "028003930",
    "MSRP": "$17.95",
    "FRAGRANCE": "Fragrance notes: Fresh Strawberries, Golden Shortcake, Whipped Cream",
    "INGREDIENTS": "WATER (AQUA, EAU), GLYCERIN, CAPRYLIC/CAPRIC TRIGLYCERIDE, ISOHEXADECANE, FRAGRANCE (PARFUM), CETYL ALCOHOL, C12-15 ALKYL BENZOATE, GLYCERYL STEARATE SE, PALMITIC ACID, STEARIC ACID, DIMETHICONE, THEOBROMA CACAO (COCOA) SEED BUTTER, BUTYROSPERMUM PARKII (SHEA) BUTTER, PHENOXYETHANOL, POLYMETHYLSILSESQUIOXANE, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, AMINOMETHYL PROPANOL, PEG-100 STEARATE, HYDROGENATED RAPESEED OIL, CHLORPHENESIN, SODIUM DEHYDROACETATE, TOCOPHEROL, DISODIUM EDTA, ETHYLHEXYLGLYCERIN, POLYACRYLATE-13, SODIUM HYALURONATE, ALOE BARBADENSIS LEAF JUICE, POLYISOBUTENE, POLYSORBATE 20, LIMONENE, LINALOOL."
  },
  {
    "LOCATION": "1031LH06A",
    "QUANTITY": 1260,
    "PRODUCT NAME": "BRIGHT CHRISTMAS MORNING",
    "SIZE": "8 FL OZ / 226 ML",
    "PRODUCT TYPE": "BODY CREAM",
    "ITEM NUMBER": "0667659311231",
    "MSRP": "$17.95",
    "FRAGRANCE": "Fragrance notes: Ripe Red Berries, Blood Orange, Crisp Apple",
    "INGREDIENTS": "WATER (AQUA, EAU), GLYCERIN, CAPRYLIC/CAPRIC TRIGLYCERIDE, ISOHEXADECANE, FRAGRANCE (PARFUM), CETYL ALCOHOL, C12-15 ALKYL BENZOATE, GLYCERYL STEARATE SE, PALMITIC ACID, STEARIC ACID, DIMETHICONE, THEOBROMA CACAO (COCOA) SEED BUTTER, BUTYROSPERMUM PARKII (SHEA) BUTTER, PHENOXYETHANOL, POLYMETHYLSILSESQUIOXANE, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, AMINOMETHYL PROPANOL, PEG-100 STEARATE, CHLORPHENESIN, SODIUM DEHYDROACETATE, TOCOPHEROL, DISODIUM EDTA, ETHYLHEXYLGLYCERIN, POLYACRYLATE-13, HYDROGENATED RAPESEED OIL, SODIUM HYALURONATE, ALOE BARBADENSIS LEAF JUICE, POLYISOBUTENE, POLYSORBATE 20, LINALOOL, LIMONENE, CITRAL, CITRONELLOL, AMYL CINNAMAL."
  },
  {
    "LOCATION": "1031LH06B",
    "QUANTITY": 1680,
    "PRODUCT NAME": "Strawberry Pound Cake",
    "SIZE": "8 FL OZ / 236 ML",
    "PRODUCT TYPE": "FRAGRANCE MIST",
    "ITEM NUMBER": "0667559282440",
    "MSRP": "$17.95",
    "FRAGRANCE": "Fragrance notes: Fresh Strawberries, Golden shortcake, Whipped cream.",
    "INGREDIENTS": "ALCOHOL DENAT. WATER (AQUA. EAU), FRAGRANCE (PARFUM), PROPYLENE GLYCOL, ETHYLHEXYL METHOXYCINNAMATE ETHYLHEXYL SALICYLATE, BUTYL METHOXYDIBENZOYLMETHANE, LIMONENE, LINALOOL, RED 33 (CI 17200). YELLOW 6 (CI 15985), YELLOW 5 (CI 19140), EXT VIOLET 2 (CI 60730)."
  },
  {
    "LOCATION": "1031RH01",
    "QUANTITY": 630,
    "PRODUCT NAME": "Emily in Paris Champagne In Paris",
    "SIZE": "8 FL OZ / 226 ML",
    "PRODUCT TYPE": "BODY CREAM",
    "ITEM NUMBER": "028008347",
    "MSRP": "$18.95",
    "FRAGRANCE": "Fragrance notes: champagne spritz, elderberry fizz and lily of the valley.",
    "INGREDIENTS": "WATER (AQUA, EAU), GLYCERIN, CAPRYLIC/CAPRIC TRIGLYCERIDE, ISOHEXADECANE, FRAGRANCE (PARFUM), CETYL ALCOHOL, C12-15 ALKYL BENZOATE, GLYCERYL STEARATE SE, PALMITIC ACID, STEARIC ACID, DIMETHICONE, THEOBROMA CACAO (COCOA) SEED BUTTER, BUTYROSPERMUM PARKII (SHEA) BUTTER, PHENOXYETHANOL, POLYMETHYLSILSQUIOXANE, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, AMINOMETHYL PROPANOL, PEG-100 STEARATE, CHLORPHENESIN, SODIUM DEHYDROACETATE, TOCOPHEROL, DISODIUM EDTA, ETHYLHEXYLGLYCERIN, POLYACRYLATE-13, HYDROGENATED RAPESEED OIL, SODIUM HYALURONATE, ALOE BARBADENSIS LEAF JUICE, POLYISOBUTENE, POLYSORBATE 20, BENZYL SALICYLATE, HYDROXYCITRONELLAL, LIMONENE, LINALOOL, CITRONELLOL, BENZYL BENZOATE."
  },
  {
    "LOCATION": "1031RH01A",
    "QUANTITY": 630,
    "PRODUCT NAME": "Emily in Paris Champagne In Paris",
    "SIZE": "10 FL OZ / 295 ML",
    "PRODUCT TYPE": "BODY WASH",
    "ITEM NUMBER": "028008681",
    "MSRP": "$15.95",
    "FRAGRANCE": "Fragrance notes: champagne spritz, elderberry fizz and lily of the valley.",
    "INGREDIENTS": "WATER (AQUA, EAU), COCAMIDOPROPYL BETAINE, SODIUM METHYL COCOYL TAURATE, FRAGRANCE (PARFUM), SODIUM LAUROYL METHYL ISETHIONATE, SODIUM LAUROYL ISETHIONATE, OLETH-10, ALOE BARBADENSIS LEAF JUICE, GLYCERIN, PEG-120 METHYL GLUCOSE TRIOLEATE, PHENOXYETHANOL, HYDROXYACETOPHENONE, PANTHENOL, PEG-33, TETRASODIUM EDTA, PEG-8 Dimethicone, Propanediol, Polysorbate 20, PEG-14, Decylene Glycol, Caprylyl Glycol, PPG-12-Buteth-16, BHT, Citric Acid, PEG-150 Pentaerythrityl Tetrastearate, Sodium Hydroxide, PPG-26-Buteth-26, PEG-6 Caprylic/Capric Glycerides, PEG-40 Hydrogenated Castor Oil, Ethylhexyl Methoxycinnamate, Butyl Methoxydibenzoylmethane, Ethylhexyl Salicylate, Benzyl Salicylate, Hydroxycitronellal, Limonene, Ext. Violet 2 (CI 60730)."
  },
  {
    "LOCATION": "1031RH01B",
    "QUANTITY": 630,
    "PRODUCT NAME": "Emily in Paris Paris Amour",
    "SIZE": "10 FL OZ / 295 ML",
    "PRODUCT TYPE": "BODY WASH",
    "ITEM NUMBER": "028008682",
    "MSRP": "$16.95",
    "FRAGRANCE": "Fragrance notes: French tulips, apple blossoms, sparkling pink champagne, sandalwood and creamy musk.",
    "INGREDIENTS": "WATER (AQUA, EAU), COCAMIDOPROPYL BETAINE, SODIUM METHYL COCOYL TAURATE, FRAGRANCE (PARFUM), SODIUM LAUROYL METHYL ISETHIONATE, SODIUM LAUROYL ISETHIONATE, OLETH-10, ALOE BARBADENSIS LEAF JUICE, GLYCERIN, PEG-120 METHYL GLUCOSE TRIOLEATE, PHENOXYETHANOL, HYDROXYACETOPHENONE, PANTHENOL, PEG-33, TETRASODIUM EDTA, PEG-8 Dimethicone, Propanediol, Polysorbate 20, PEG-14, Decylene Glycol, Caprylyl Glycol, BHT, PPG-12-Buteth-16, Citric Acid, PEG-150 Pentaerythrityl Tetrastearate, Sodium Hydroxide, PPG-26-Buteth-26, PEG-6 Caprylic/Capric Glycerides, PEG-40 Hydrogenated Castor Oil, Ethylhexyl Methoxycinnamate, Butyl Methoxydibenzoylmethane, Ethylhexyl Salicylate, Linalool, Limonene, Benzyl Salicylate, Geraniol, Benzyl Alcohol, Citronellol, Hexyl Cinnamal, Ext. Violet 2 (CI 60730)."
  }
];

async function updateProducts() {
  console.log('Starting product update script...');

  for (const productData of productsToUpdate) {
    const {
      "LOCATION": location,
      "QUANTITY": quantity,
      "PRODUCT NAME": name,
      "SIZE": size,
      "PRODUCT TYPE": product_type,
      "ITEM NUMBER": item_number,
      "MSRP": msrpString,
      "FRAGRANCE": fragrance,
      "INGREDIENTS": ingredientsString,
    } = productData;

    const msrp = parseFloat(msrpString.replace('$', ''));
    const ingredients = ingredientsString.split(', ').map(s => s.trim());
    const description = fragrance; // Using fragrance notes as description
    const image_url = `/product-images/${item_number}.jpg`; // Front image by default

    try {
      // Check if product exists
      const { data: existingProducts, error: fetchError } = await supabase
        .from('products')
        .select('id')
        .eq('item_number', item_number);

      if (fetchError) {
        console.error(`Error fetching product ${item_number}:`, fetchError);
        continue;
      }

      const productToUpsert = {
        name,
        product_type,
        size,
        msrp,
        item_number,
        scent: fragrance,
        ingredients,
        description,
        image_url,
        is_active: true,
        quantity,
        location,
        brand_website_link: null, // Ensure this is removed
      };

      if (existingProducts && existingProducts.length > 0) {
        // Update existing product
        const { error: updateError } = await supabase
          .from('products')
          .update(productToUpsert)
          .eq('id', existingProducts[0].id);

        if (updateError) {
          console.error(`Error updating product ${name} (${item_number}):`, updateError);
        } else {
          console.log(`Successfully updated product: ${name} (${item_number})`);
        }
      } else {
        // Insert new product
        const { error: insertError } = await supabase
          .from('products')
          .insert(productToUpsert);

        if (insertError) {
          console.error(`Error inserting product ${name} (${item_number}):`, insertError);
        } else {
          console.log(`Successfully inserted product: ${name} (${item_number})`);
        }
      }
    } catch (error) {
      console.error(`An unexpected error occurred for product ${name} (${item_number}):`, error);
    }
  }
  console.log('Product update script finished.');
}

updateProducts();