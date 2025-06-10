require("dotenv").config();
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var supabase_js_1 = require("@supabase/supabase-js");
var supabaseUrl = process.env.VITE_SUPABASE_URL;
var supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
var supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
var productsToUpdate = [
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
function updateProducts() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, productsToUpdate_1, productData, location_1, quantity, name_1, size, product_type, item_number, msrpString, fragrance, ingredientsString, msrp, ingredients, description, image_url, _a, existingProducts, fetchError, productToUpsert, updateError, insertError, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('Starting product update script...');
                    _i = 0, productsToUpdate_1 = productsToUpdate;
                    _b.label = 1;
                case 1:
                    if (!(_i < productsToUpdate_1.length)) return [3 /*break*/, 10];
                    productData = productsToUpdate_1[_i];
                    location_1 = productData["LOCATION"], quantity = productData["QUANTITY"], name_1 = productData["PRODUCT NAME"], size = productData["SIZE"], product_type = productData["PRODUCT TYPE"], item_number = productData["ITEM NUMBER"], msrpString = productData["MSRP"], fragrance = productData["FRAGRANCE"], ingredientsString = productData["INGREDIENTS"];
                    msrp = parseFloat(msrpString.replace('$', ''));
                    ingredients = ingredientsString.split(', ').map(function (s) { return s.trim(); });
                    description = fragrance;
                    image_url = "/product-images/".concat(item_number, ".jpg");
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 8, , 9]);
                    return [4 /*yield*/, supabase
                            .from('products')
                            .select('id')
                            .eq('item_number', item_number)];
                case 3:
                    _a = _b.sent(), existingProducts = _a.data, fetchError = _a.error;
                    if (fetchError) {
                        console.error("Error fetching product ".concat(item_number, ":"), fetchError);
                        return [3 /*break*/, 9];
                    }
                    productToUpsert = {
                        name: name_1,
                        product_type: product_type,
                        size: size,
                        msrp: msrp,
                        item_number: item_number,
                        scent: fragrance,
                        ingredients: ingredients,
                        description: description,
                        image_url: image_url,
                        is_active: true,
                        quantity: quantity,
                        location: location_1,
                        brand_website_link: null, // Ensure this is removed
                    };
                    if (!(existingProducts && existingProducts.length > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, supabase
                            .from('products')
                            .update(productToUpsert)
                            .eq('id', existingProducts[0].id)];
                case 4:
                    updateError = (_b.sent()).error;
                    if (updateError) {
                        console.error("Error updating product ".concat(name_1, " (").concat(item_number, "):"), updateError);
                    }
                    else {
                        console.log("Successfully updated product: ".concat(name_1, " (").concat(item_number, ")"));
                    }
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, supabase
                        .from('products')
                        .insert(productToUpsert)];
                case 6:
                    insertError = (_b.sent()).error;
                    if (insertError) {
                        console.error("Error inserting product ".concat(name_1, " (").concat(item_number, "):"), insertError);
                    }
                    else {
                        console.log("Successfully inserted product: ".concat(name_1, " (").concat(item_number, ")"));
                    }
                    _b.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_1 = _b.sent();
                    console.error("An unexpected error occurred for product ".concat(name_1, " (").concat(item_number, "):"), error_1);
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 1];
                case 10:
                    console.log('Product update script finished.');
                    return [2 /*return*/];
            }
        });
    });
}
updateProducts();
