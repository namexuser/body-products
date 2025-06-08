
import React, { useState, useMemo } from 'react';
import { ExternalLink, Package, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { productData, Product } from '../data/productData';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

const ProductCatalog = () => {
  const [filters, setFilters] = useState({
    productType: 'all',
    scent: '',
    search: ''
  });
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    return productData.filter(product => {
      const matchesType = filters.productType === 'all' || product.productType === filters.productType;
      const matchesScent = !filters.scent || product.scent.toLowerCase().includes(filters.scent.toLowerCase());
      const matchesSearch = !filters.search || 
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.itemNumber.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesType && matchesScent && matchesSearch;
    });
  }, [filters]);

  const productTypes = [...new Set(productData.map(p => p.productType))];

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    addToCart({
      id: product.id,
      name: product.name,
      size: product.size,
      msrp: product.msrp,
      itemNumber: product.itemNumber
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

  const clearFilters = () => {
    setFilters({ productType: 'all', scent: '', search: '' });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Product Catalog</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Browse our premium body care collection. View detailed product information and images on brand websites, then add your selections to cart for quick ordering.
          </p>
        </div>

        {/* Filters Section */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Filter Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                    <div className="text-center">
                      <Package size={48} className="text-muted-foreground mx-auto mb-2" />
                      <span className="text-xs text-muted-foreground">Product Image</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground font-medium">{product.size}</p>
                </CardHeader>
                
                <CardContent className="flex-1 space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">SKU:</span>
                      <span className="text-sm font-mono">{product.itemNumber}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">MSRP:</span>
                      <span className="text-xl font-bold text-primary">${product.msrp.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Type:</span>
                      <span className="text-sm">{product.productType}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Scent:</span>
                      <span className="text-sm">{product.scent}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-4 flex flex-col gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(product.brandWebsiteLink, '_blank')}
                  >
                    <ExternalLink size={16} className="mr-2" />
                    View Details & Photos
                  </Button>
                  
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-center gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(product.id, -1)}
                      className="h-9 w-9 p-0"
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
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(product.id, 1)}
                      className="h-9 w-9 p-0"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full h-10"
                    size="sm"
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
