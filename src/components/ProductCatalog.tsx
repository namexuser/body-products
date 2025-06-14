import React, { useState, useMemo, useEffect } from 'react';
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
  quantity: number; // Flattened quantity from inventory
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
  inventory: Inventory[] | SelectQueryError<string> | null | undefined;
}
const ProductCatalog = () => {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    productType: 'all',
    search: ''
  });
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [expandedIngredients, setExpandedIngredients] = useState<Record<string, boolean>>({});
  const [currentImage, setCurrentImage] = useState<Record<string, 'front' | 'back'>>({});
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, image_url, sku, product_type, size, scent, ingredients, msrp, inventory(quantity_in_stock)')
        .order('name');

      if (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
        return;
      }

      if (data) {
        // Map the fetched data to the DisplayProduct interface
        const productsWithInventory: DisplayProduct[] = (data as any).map((product: RawFetchedProduct) => {
          console.log('Type of data[0].inventory:', typeof data[0].inventory);
          const quantity = (product.inventory && Array.isArray(product.inventory) && product.inventory.length > 0)
            ? product.inventory[0].quantity_in_stock
            : 0;

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
            quantity: quantity,
          };
        });

        setProducts(productsWithInventory);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesType = filters.productType === 'all' || (typeof product.product_type === 'string' && product.product_type.toLowerCase() === filters.productType);
      const matchesSearch = !filters.search ||
        (typeof product.name === 'string' && product.name.toLowerCase().includes(filters.search.toLowerCase())) ||
        (typeof product.sku === 'string' && product.sku.toLowerCase().includes(filters.search.toLowerCase()));

      return matchesType && matchesSearch;
    });
  }, [products, filters]);

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
    const quantity = quantities[product.id] || 250; // Default to 250 units
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

    toast.success(`Added ${quantity} x ${product.name} to cart`);
    setQuantities(prev => ({ ...prev, [product.id]: 250 })); // Reset to 250 after adding
  };

  const updateQuantity = (productId: string, change: number) => {
    setQuantities(prev => {
      const currentQty = prev[productId] || 250; // Default to 250
      const newQty = Math.max(250, currentQty + change); // Ensure minimum of 250
      return { ...prev, [productId]: newQty };
    });
  };

  const toggleIngredients = (productId: string) => {
    setExpandedIngredients(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const clearFilters = () => {
    setFilters({ productType: 'all', search: '' });
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
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Product Catalog</h1>
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

        {/* Search Input */}
        <div className="mb-8">
          <Input
            placeholder="Search products by name or SKU..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full max-w-md mx-auto"
          />
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
              <Card key={product.id} className="hover:shadow-lg transition-all duration-200 flex flex-col h-full">
                <CardHeader className="p-0 relative">
                  <div className="w-full h-48 bg-muted rounded-t-lg flex items-center justify-center overflow-hidden relative">
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
                        <Badge variant="secondary" className="absolute top-2 right-2 bg-white/80 text-foreground px-3 py-1 rounded-full text-xs font-semibold">
                          {product.product_type}
                        </Badge>
                        <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 p-2 bg-gradient-to-t from-black/50 to-transparent">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-xs h-7 px-3"
                            onClick={() => setCurrentImage(prev => ({ ...prev, [product.id]: 'front' }))}
                          >
                            Front
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-xs h-7 px-3"
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
 
                <CardContent className="p-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg font-semibold leading-tight">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Size:</span> {product.size}
                    </p>
                    {product.scent && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Fragrance Notes:</span> {product.scent}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Available:</span> {product.quantity} units
                    </p>
 
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
 
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium">MSRP:</span>
                      <span className="text-xl font-bold text-primary line-through">${product.msrp.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-center gap-2 w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(product.id, -250)}
                        className="h-9 w-9 p-0"
                        disabled={product.quantity === 0 || (quantities[product.id] || 250) <= 250}
                      >
                        <Minus size={16} />
                      </Button>
                      <Input
                        type="number"
                        min="250"
                        step="250"
                        value={quantities[product.id] || 250}
                        onChange={(e) => setQuantities(prev => ({
                          ...prev,
                          [product.id]: Math.max(250, parseInt(e.target.value) || 250)
                        }))}
                        className="w-24 text-center h-9"
                        disabled={product.quantity === 0}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(product.id, 250)}
                        className="h-9 w-9 p-0"
                        disabled={product.quantity === 0}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>

                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full h-10"
                      size="sm"
                      disabled={product.quantity === 0}
                    >
                      <Plus size={16} className="mr-2" />
                      Add to Cart ({quantities[product.id] || 250} units)
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
      </div>
    </div>
  );
};

export default ProductCatalog;
