import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Package, Plus, Minus, Info, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Add the map here
const skuCaseQuantities: Record<string, number> = {
  "667559299899": 12,
  "667659313242": 12,
  "667559299882": 12,
  "667559299820": 18,
  "667559282563": 12,
  "667559282501": 18,
  "667659311231": 18,
  "667559282440": 24,
  "667659322251": 12,
  "667659330638": 12,
  "667659330645": 12,
  "667559282662": 18,
  "667659330652": 12,
  "667559299363": 24,
  "667559299875": 12,
  "667558216231": 24,
  "667559299950": 18,
  "667659320462": 12,
  "667558216255": 24,
  "667559279969": 12,
  "667559265665": 12,
  "667559288381": 24,
  "667559299370": 24,
  "667559299837": 18,
  "667659322282": 24,
  "667559294504": 24,
  "667559279211": 36,
  "667559294542": 36,
  "667559272496": 36,
  "667659311279": 21,
  "667559299936": 18,
  "667559299813": 18,
  "667558216248": 24,
  "667559139690": 35,
  "667559261148": 18,
  "667559261124": 12,
  "667559281627": 24,
  "667559281665": 12,
  "667559273059": 40,
};

// Interface for the data returned directly from the Supabase query
// Adjusted based on typical Supabase join results
interface SelectQueryError<T extends string = string> {
  error: boolean;
  message: T;
}

// Interface for the data returned directly from the Supabase query
// Adjusted based on typical Supabase join results
interface SelectQueryError<T extends string = string> {
  error: boolean;
  message: T;
}

// Interface for the raw data returned directly from the Supabase query
interface DisplayProduct {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sku: string;
  product_type: string;
  size: string;
  scent: string | null;
  ingredients: string[] | null;
  msrp: number;
  quantity: number; // Total units in stock
  caseQuantity: number; // Units per case
}


// Interface for the raw data returned directly from the Supabase query
interface Inventory {
  quantity_in_stock: number;
};

interface RawFetchedProduct {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sku: string;
  product_type: string;
  size: string;
  scent: string | null;
  ingredients: string[] | null;
  msrp: number;
  inventory: { quantity_in_stock: number }[] | SelectQueryError<string> | null; // Reverted to include SelectQueryError
}
const toTitleCase = (str: string | null | undefined): string => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
};
const ProductCatalog = () => {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    productType: 'all'
  });
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [expandedIngredients, setExpandedIngredients] = useState<Record<string, boolean>>({});
  const [currentImage, setCurrentImage] = useState<Record<string, 'front' | 'back'>>({});
  const { addToCart } = useCart();

  const containerRef = useRef<HTMLDivElement>(null); // Ref for the main container

  useEffect(() => {
    fetchProducts();
  }, []); // Fetch all products on initial load


  const fetchProducts = async () => {
    setLoading(true);

    try {
      // Fetch all products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, description, image_url, sku, product_type, size, scent, ingredients, msrp')
        .order('name');

      if (productsError) {
        console.error('Error fetching products:', productsError);
        toast.error('Failed to load products');
        setLoading(false);
        return;
      }

      // Fetch inventory data separately
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('inventory')
        .select('product_id, quantity_in_stock');

      if (inventoryError) {
        console.error('Error fetching inventory:', inventoryError);
        toast.error('Failed to load inventory data');
        // Continue with products data even if inventory fails, showing 0 stock
      }

      if (productsData) {
        console.log('Fetched products data:', productsData); // Log fetched data
        console.log('Fetched inventory data:', inventoryData); // Log fetched inventory data

        // Create a map for quick lookup of inventory by product_id
        const inventoryMap = new Map<string, number>();
        if (inventoryData) {
          inventoryData.forEach(item => {
            inventoryMap.set(item.product_id, item.quantity_in_stock);
          });
        }

        // Map the fetched product data and merge with inventory
        const productsWithInventory: DisplayProduct[] = productsData.map((product) => {
          const quantity = inventoryMap.get(product.id) || 0; // Get quantity from map, default to 0
          const caseQuantity = skuCaseQuantities[product.sku] || 1; // Get case quantity from map, default to 1

          // Log product details for debugging missing images
          if (product.sku === '0667659330638' || product.sku === '0667559288381') {
            console.log(`Debugging image for SKU ${product.sku}:`, {
              productName: product.name,
              sku: product.sku,
              image_url_from_db: product.image_url,
              constructed_front_url: `/product-images/${product.sku}.png`,
              constructed_back_url: `/product-images/${product.sku}-B.png`,
              has_image_url_in_db: !!product.image_url,
              quantity: quantity,
            });
          }


          return {
            id: product.id,
            name: product.name,
            description: product.description,
            image_url: product.image_url,
            sku: product.sku,
            product_type: product.product_type,
            size: product.size,
            scent: product.scent,
            ingredients: product.ingredients,
            msrp: product.msrp,
            quantity: quantity, // Total units
            caseQuantity: caseQuantity, // Units per case
          };
        });

        // Set products to the fetched list (no appending needed for full load)
        setProducts(productsWithInventory);
        // Initialize quantities state with the case quantity for each product
        const initialQuantities: Record<string, number> = {};
        productsWithInventory.forEach(product => {
            initialQuantities[product.id] = product.caseQuantity; // Default to one case
        });
        setQuantities(initialQuantities);

      } else {
        // If no data is returned, set products to empty array
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
      setProducts([]); // Set products to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesType = filters.productType === 'all' || (typeof product.product_type === 'string' && product.product_type.toLowerCase() === filters.productType);

      return matchesType;
    });
  }, [products, filters.productType]);

  const productTypes = useMemo(() => {
    // Filter products to get only those with valid string product_type,
    // then map to get the types, create a Set for uniqueness, convert back to array, sort, and prepend 'All'.
    const types = Array.from(new Set(products
      .filter(product => typeof product.product_type === 'string' && product.product_type)
      .map(product => product.product_type)
    )).sort();

    return ['All', ...types];
  }, [products]);


  const handleAddToCart = (product: DisplayProduct) => {
    const quantity = quantities[product.id] || 1; // Default to 1 unit
    addToCart({
      id: product.id,
      name: product.name,
      image_url: product.image_url,
      sku: product.sku,
      description: product.description,
      product_type: product.product_type,
      size: product.size,
      scent: product.scent,
      ingredients: product.ingredients,
      msrp: product.msrp,
    }, quantity);

    toast.success(`Added ${quantity} units of ${product.name} to cart`);
    setQuantities(prev => ({ ...prev, [product.id]: product.caseQuantity })); // Reset to 1 case after adding
  };

  const updateQuantity = (productId: string, changeInCases: number) => {
    setQuantities(prev => {
      const product = products.find(p => p.id === productId);
      if (!product) return prev;

      const currentQtyUnits = prev[productId] || product.caseQuantity; // Default to one case in units
      let newQtyUnits = currentQtyUnits + (changeInCases * product.caseQuantity); // Change is in units

      // Ensure quantity is a multiple of caseQuantity
      newQtyUnits = Math.max(product.caseQuantity, Math.floor(newQtyUnits / product.caseQuantity) * product.caseQuantity);

      // Ensure quantity does not exceed available stock
      newQtyUnits = Math.min(newQtyUnits, product.quantity);

      // Enforce minimum order of 250 units, but allow adding in case quantities
      if (newQtyUnits < 250 && newQtyUnits !== product.caseQuantity) {
         // If the new quantity is less than 250 and not exactly one case,
         // snap it to the nearest multiple of caseQuantity that is >= 250,
         // or set to one case if that's the only valid option below 250.
         const minOrderMultiple = Math.ceil(250 / product.caseQuantity) * product.caseQuantity;
         newQtyUnits = Math.max(minOrderMultiple, newQtyUnits);
      }

      return { ...prev, [productId]: newQtyUnits };
    });
  };

  const toggleIngredients = (productId: string) => {
    setExpandedIngredients(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const clearFilters = () => {
    setFilters({ productType: 'all' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Catalog</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Browse product details and add items to your cart for easy ordering. Minimum order is 250 units. Enjoy discounts of 73% to 84% off MSRP.
          </p>
        </div>

        {/* Filters Section */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            key="all"
            variant={filters.productType === 'all' ? 'default' : 'outline'}
            onClick={() => setFilters(prev => ({ ...prev, productType: 'all' }))}
            className="px-6 py-2 rounded-full"
          >
            All
          </Button>
          {productTypes
            .filter((type) => type !== 'All')
            .map((type) => {
              // Ensure type is a string before rendering the button
              if (typeof type !== 'string') {
                console.warn('Skipping invalid product type:', type);
                return null; // Skip rendering if type is not a string
              }
              return (
                <Button
                  key={type}
                  variant={filters.productType === type.toLowerCase() ? 'default' : 'outline'}
                  onClick={() => setFilters((prev) => ({ ...prev, productType: type.toLowerCase() }))}
                  className="px-6 py-2 rounded-full"
                >
                  {type}
                </Button>
              );
            })}
        </div>


        {/* Results Summary */}
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Card key={product.id} className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 flex flex-col h-full">
                <CardHeader className="p-0 relative">
                  <div className="w-full h-48 bg-muted flex items-center justify-center overflow-hidden relative">
                    {product.image_url ? (
                      <>
                        <a
                          href={currentImage[product.id] === 'back' ? `/product-images/${product.sku}-B.png` : `/product-images/${product.sku}.png`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full h-full"
                        >
                          <img
                            src={currentImage[product.id] === 'back' ? `/product-images/${product.sku}-B.png` : `/product-images/${product.sku}.png`}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </a>
                        <Badge variant="secondary" className="absolute top-2 right-2 bg-black text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {product.product_type}
                        </Badge>
                        <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 p-2 bg-gradient-to-t from-black/50 to-transparent">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-xs h-7 px-3 bg-white/80 text-black hover:bg-white"
                            onClick={() => setCurrentImage(prev => ({ ...prev, [product.id]: 'front' }))}
                          >
                            Front
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-xs h-7 px-3 bg-white/80 text-black hover:bg-white"
                            onClick={() => setCurrentImage(prev => ({ ...prev, [product.id]: 'back' }))}
                          >
                            Back
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <Package size={48} className="text-muted-foreground mx-auto mb-2" />
                        <span className="text-xs text-muted-foreground">Product Image</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
 
                <CardContent className="p-4 flex flex-col justify-between flex-grow space-y-2"> {/* Adjusted padding and spacing */}
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold leading-tight">{product.name}</CardTitle>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-muted-foreground">Size:</span>
                      <span className="text-foreground">{product.size}</span>
                    </div>
                    {product.scent && (
                      <div className="flex flex-col text-sm">
                        <span className="font-medium text-muted-foreground mb-1">Fragrance Notes:</span>
                        <span className="text-foreground">{toTitleCase(product.scent)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-muted-foreground">Available:</span>
                      <span className="text-foreground">{product.quantity} units</span>
                      {product.quantity > 0 && product.quantity <= (product.caseQuantity * 5) && ( // Low stock if less than 5 cases
                        <Badge variant="destructive" className="ml-2">Low Stock</Badge>
                      )}
                    </div>

                    {product.ingredients && product.ingredients.length > 0 && (
                      <Collapsible
                        open={expandedIngredients[product.id]}
                        onOpenChange={() => toggleIngredients(product.id)}
                        className="mt-2"
                      >
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-full justify-between p-2 text-sm">
                            <span className="flex items-center gap-2">
                               <Info size={14} />
                               Ingredients
                            </span>
                            <span className="text-xs">
                               {expandedIngredients[product.id] ? 'Hide' : 'Show'}
                            </span>
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 pt-2">
                          <div className="flex flex-wrap gap-1">
                            {product.ingredients.map((ingredient, index) => (
                               <Badge key={index} variant="outline" className="text-xs">
                                 {ingredient}
                               </Badge>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </div>

                  <div className="mt-auto pt-4"> {/* Use mt-auto to push to bottom */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-muted-foreground">MSRP:</span>
                      <span className="text-xl font-bold text-gray-600 line-through">${product.msrp.toFixed(2)}</span> {/* Adjusted color */}
                    </div>

                    <div className="flex items-center gap-2 w-full mb-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(product.id, -1)} // Decrement by 1 case
                        className="h-9 w-9"
                        disabled={product.quantity === 0 || (quantities[product.id] || product.caseQuantity) <= product.caseQuantity} // Disable if quantity is 0 or already at minimum (1 case)
                      >
                        <Minus size={16} />
                      </Button>
                      <Input
                        type="number"
                        min={product.caseQuantity} // Minimum is one case
                        step={product.caseQuantity} // Step is one case
                        value={quantities[product.id] || product.caseQuantity} // Default to one case
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          const newQty = Math.max(product.caseQuantity, isNaN(value) ? product.caseQuantity : Math.floor(value / product.caseQuantity) * product.caseQuantity); // Ensure multiple of caseQuantity and minimum of one case
                          setQuantities(prev => ({
                            ...prev,
                            [product.id]: Math.min(newQty, product.quantity) // Ensure not more than available stock
                          }));
                        }}
                        className="w-full sm:w-24 text-center h-9"
                        disabled={product.quantity === 0}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(product.id, 1)} // Increment by 1 case
                        className="h-9 w-9"
                        disabled={product.quantity === 0 || (quantities[product.id] || product.caseQuantity) + product.caseQuantity > product.quantity} // Disable if quantity is 0 or adding another case exceeds stock
                      >
                        <Plus size={16} />
                      </Button>
                    </div>

                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90"
                      size="sm"
                      disabled={product.quantity === 0}
                    >
                      <Plus size={16} className="mr-2" />
                      Add to Cart ({quantities[product.id] || product.caseQuantity} units)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="py-16">
            <CardContent className="text-center">
              <Package size={64} className="mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-medium text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading indicator for infinite scroll */}
      </div>
    </div>
  );
};

export default ProductCatalog;
