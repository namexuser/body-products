
import React, { useState, useMemo } from 'react';
import { ExternalLink, Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { productData, Product } from '../data/productData';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

const ProductCatalog = () => {
  const [filters, setFilters] = useState({
    productType: '',
    scent: '',
    search: ''
  });
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    return productData.filter(product => {
      const matchesType = !filters.productType || product.productType === filters.productType;
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

  const clearFilters = () => {
    setFilters({ productType: '', scent: '', search: '' });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">Product Catalog</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse our selection of premium body care products. Click "View Full Details" to see product images and detailed descriptions on the brand's official website.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Filter Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product Type</label>
            <Select value={filters.productType} onValueChange={(value) => setFilters(prev => ({ ...prev, productType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {productTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Scent</label>
            <Input
              placeholder="e.g., Lavender"
              value={filters.scent}
              onChange={(e) => setFilters(prev => ({ ...prev, scent: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <Input
              placeholder="Product name or SKU"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          
          <div className="flex items-end">
            <Button variant="outline" onClick={clearFilters} className="w-full">
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Package size={48} className="text-gray-400" />
                <span className="ml-2 text-gray-500 text-sm">Product Image</span>
              </div>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{product.size}</p>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">SKU:</span>
                <span className="text-sm">{product.itemNumber}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">MSRP:</span>
                <span className="text-lg font-bold text-primary">${product.msrp.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Type:</span>
                <span className="text-sm">{product.productType}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Scent:</span>
                <span className="text-sm">{product.scent}</span>
              </div>
            </CardContent>
            
            <CardFooter className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(product.brandWebsiteLink, '_blank')}
              >
                <ExternalLink size={16} className="mr-2" />
                View Full Details & Photo on Brand Website
              </Button>
              
              <div className="flex items-center space-x-2 w-full">
                <Input
                  type="number"
                  min="1"
                  value={quantities[product.id] || 1}
                  onChange={(e) => setQuantities(prev => ({ ...prev, [product.id]: parseInt(e.target.value) || 1 }))}
                  className="w-20"
                />
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1"
                >
                  <Plus size={16} className="mr-2" />
                  Add to Cart
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your filters to see more products.</p>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
