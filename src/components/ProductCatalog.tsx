
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

interface DatabaseProduct {
  id: string;
  name: string;
  product_type: string;
  size: string;
  msrp: number;
  item_number: string;
  scent: string;
  ingredients: string[] | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  quantity: number | null;
  location: string | null;
}

const ProductCatalog = () => {
  const [products, setProducts] = useState<DatabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    productType: 'all',
    scent: '',
    search: ''
  });
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [expandedIngredients, setExpandedIngredients] = useState<Record<string, boolean>>({});
  const [currentImage, setCurrentImage] = useState<Record<string, 'front' | 'back'>>({});
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const inventoryItemNumbers = [
    "028005794", "028007116", "0667559299882", "028005784",
    "028003936", "028003930", "0667659311231", "0667559282440",
    "028008347", "028008681", "028008682"
  ];

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, quantity, location')
        .eq('is_active', true)
        .in('item_number', inventoryItemNumbers) // Filter by inventory item numbers
        .order('name');

      if (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesType = filters.productType === 'all' || product.product_type === filters.productType;
      const matchesScent = !filters.scent || product.scent.toLowerCase().includes(filters.scent.toLowerCase());
      const matchesSearch = !filters.search || 
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.item_number.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesType && matchesScent && matchesSearch;
    });
  }, [products, filters]);

  const productTypes = [...new Set(products.map(p => p.product_type))];

  const handleAddToCart = (product: DatabaseProduct) => {
    const quantity = quantities[product.id] || 1;
    addToCart({
      id: product.id,
      name: product.name,
      type: product.product_type,
      size: product.size,
      msrp: product.msrp,
      itemNumber: product.item_number
    }, quantity);
    
    toast.success(`Added ${quantity} x ${product.name} to cart`);
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  const updateQuantity = (productId: string, change: number) => {
    setQuantities(prev => {
      const currentQty = prev[productId] || 1;
      const newQty = Math.max(1, currentQty + change);
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
    setFilters({ productType: 'all', scent: '', search: '' });
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
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Filter Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Product Type</label>
                <Select value={filters.productType} onValueChange={(value) => setFilters(prev => ({ ...prev, productType: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {productTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Scent</label>
                <Input
                  placeholder="e.g., Lavender, Vanilla..."
                  value={filters.scent}
                  onChange={(e) => setFilters(prev => ({ ...prev, scent: e.target.value }))}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Search</label>
                <Input
                  placeholder="Product name or SKU..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Clear All Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <CardHeader className="text-center pb-4">
                  <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center mb-4 overflow-hidden relative">
                    {product.image_url ? (
                      <>
                        <a
                          href={currentImage[product.id] === 'back' ? `/product-images/${product.item_number}-B.jpg` : `/product-images/${product.item_number}.jpg`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full h-full"
                        >
                          <img
                            src={currentImage[product.id] === 'back' ? `/product-images/${product.item_number}-B.jpg` : `/product-images/${product.item_number}.jpg`}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </a>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/70 hover:bg-white"
                          onClick={() => setCurrentImage(prev => ({
                            ...prev,
                            [product.id]: prev[product.id] === 'back' ? 'front' : 'back'
                          }))}
                        >
                          <RefreshCcw size={16} />
                        </Button>
                      </>
                    ) : (
                      <div className="text-center">
                        <Package size={48} className="text-muted-foreground mx-auto mb-2" />
                        <span className="text-xs text-muted-foreground">Product Image</span>
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground font-medium">{product.size}</p>
                  {product.description && (
                    <p className="text-xs text-muted-foreground mt-2">{product.description}</p>
                  )}
                </CardHeader>
                
                <CardContent className="flex-1 space-y-3">
                  <div className="space-y-2">
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">MSRP:</span>
                      <span className="text-xl font-bold text-primary">${product.msrp.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Type:</span>
                      <Badge variant="secondary">{product.product_type}</Badge>
                    </div>
                  

                    {/* Inventory Section */}
                    {/* Inventory Section */}
                    {product.quantity !== null && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Availability:</span>
                          {product.quantity > 100 ? (
                            <Badge variant="default" className="bg-green-500 hover:bg-green-500">In Stock</Badge>
                          ) : product.quantity > 0 ? (
                            <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-500">Low Stock</Badge>
                          ) : (
                            <Badge variant="destructive">Out of Stock</Badge>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Quantity:</span>
                          <span className="text-sm">{product.quantity}</span>
                        </div>

                      </div>
                    )}

                    {/* Ingredients Section */}
                    {product.ingredients && product.ingredients.length > 0 && (
                      <div className="border-t pt-3">
                        <Collapsible
                          open={expandedIngredients[product.id]}
                          onOpenChange={() => toggleIngredients(product.id)}
                        >
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-full justify-between p-2">
                              <span className="text-sm font-medium flex items-center gap-2">
                                <Info size={14} />
                                Ingredients
                              </span>
                              <span className="text-xs">
                                {expandedIngredients[product.id] ? 'Hide' : 'Show'}
                              </span>
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {product.ingredients.map((ingredient, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {ingredient}
                                </Badge>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="pt-4 flex flex-col gap-3">
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-center gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(product.id, -1)}
                      className="h-9 w-9 p-0"
                      disabled={product.quantity === 0}
                    >
                      <Minus size={16} />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={quantities[product.id] || 1}
                      onChange={(e) => setQuantities(prev => ({
                        ...prev,
                        [product.id]: Math.max(1, parseInt(e.target.value) || 1)
                      }))}
                      className="w-16 text-center h-9"
                      disabled={product.quantity === 0}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(product.id, 1)}
                      className="h-9 w-9 p-0"
                      disabled={product.quantity === 0}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full h-10"
                    size="sm"
                    disabled={product.quantity === 0}
                  >
                    <Plus size={16} className="mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
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
