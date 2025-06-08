
import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    city: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { totalMSRP, totalUnits, estimatedTotal, unitPrice, statusMessage } = getCartTotal();
  const canSubmitOrder = totalMSRP >= 1000;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmitOrder) {
      toast.error('Minimum purchase requirement of $1,000 not met');
      return;
    }

    if (!clientInfo.name || !clientInfo.email || !clientInfo.phone || !clientInfo.city) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Purchase order submitted successfully! You will receive a confirmation email shortly.');
      setClientInfo({ name: '', email: '', phone: '', city: '' });
      clearCart();
    } catch (error) {
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-500">Add some products to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">Shopping Cart</h2>
        <p className="text-muted-foreground">Review your items and submit your purchase order</p>
      </div>

      {/* Cart Items */}
      <Card>
        <CardHeader>
          <CardTitle>Cart Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">SKU: {item.itemNumber} • Size: {item.size}</p>
                </div>
                
                <div className="text-right">
                  <p className="font-medium">${item.msrp.toFixed(2)} each</p>
                  <p className="text-sm text-muted-foreground">
                    Subtotal: ${(item.msrp * item.quantity).toFixed(2)}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Total Units:</span>
            <span className="font-medium">{totalUnits}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Total MSRP (before discount):</span>
            <span className="font-medium">${totalMSRP.toFixed(2)}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between">
            <span>Estimated Unit Price:</span>
            <span className="font-medium">
              {unitPrice > 0 ? `$${unitPrice.toFixed(2)}` : 'N/A'}
            </span>
          </div>
          
          <div className="flex justify-between text-lg font-bold">
            <span>Estimated Order Total:</span>
            <span className="text-primary">
              {estimatedTotal > 0 ? `$${estimatedTotal.toFixed(2)}` : 'N/A'}
            </span>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-gray-50">
            <p className="text-sm font-medium">Minimum Purchase Requirement: $1,000</p>
            <p className={`text-sm mt-1 ${canSubmitOrder ? 'text-green-600' : 'text-red-600'}`}>
              {statusMessage}
            </p>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            Final pricing subject to confirmation after order submission
          </p>
        </CardContent>
      </Card>

      {/* Client Information Form */}
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <Input
                  required
                  value={clientInfo.name}
                  onChange={(e) => setClientInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input
                  type="email"
                  required
                  value={clientInfo.email}
                  onChange={(e) => setClientInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Phone *</label>
                <Input
                  type="tel"
                  required
                  value={clientInfo.phone}
                  onChange={(e) => setClientInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <Input
                  required
                  value={clientInfo.city}
                  onChange={(e) => setClientInfo(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Your city"
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={!canSubmitOrder || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Purchase Order'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={clearCart}
                disabled={isSubmitting}
              >
                Clear Cart
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cart;
