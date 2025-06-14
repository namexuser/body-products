import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

// Helper function to format numbers with comma separators and fixed decimal places for currency
const formatCurrency = (amount: number) => {
  return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Helper function to format numbers with comma separators
const formatNumber = (num: number) => {
  return num.toLocaleString();
};
// Simple email validation regex
const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    city: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { totalMSRP, totalUnits, estimatedTotal, unitPrice, discountPercentage, statusMessage } = getCartTotal();
  const canSubmitOrder = totalUnits >= 250;
 
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmitOrder) {
      toast.error('Minimum purchase requirement of 250 units not met');
      return;
    }
 
    // Updated validation for required fields
    if (!clientInfo.name || !clientInfo.email || !clientInfo.city || !clientInfo.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!validateEmail(clientInfo.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting purchase order...');

      // Prepare cart items for the Edge Function payload
      const itemsForFunction = cartItems.map(item => ({
        product_id: item.id, // Use product_id
        quantity: item.quantity,
      }));

      const { data, error } = await supabase.functions.invoke('submit-purchase-order', {
        body: {
          customerInfo: clientInfo, // customerInfo now includes name, email, address
          cartItems: itemsForFunction, // Use the prepared items array
          totals: { // Include totals object
            totalMSRP: totalMSRP,
            totalUnits: totalUnits,
            estimatedTotal: estimatedTotal,
            unitPrice: unitPrice,
            discountPercentage: discountPercentage,
          },
        }
      });

      if (error) {
        console.error('Error submitting order:', error);
        throw new Error(error.message || 'Failed to submit order');
      }

      // Updated success message to use orderId
      if (data?.success) {
        toast.success(`Purchase order (ID: ${data.orderId}) submitted successfully! Confirmation email sent.`);
        setClientInfo({ name: '', email: '', city: '', phone: '' }); // Clear city and phone fields
        clearCart();
      } else {
        throw new Error(data?.error || 'Failed to submit order');
      }
    } catch (error: unknown) {
      console.error('Error submitting order:', error);
      toast.error((error instanceof Error ? error.message : 'Unknown error') || 'Failed to submit order. Please try again.');
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
        <h2 className="text-3xl font-bold text-primary mb-4">Purchase Order</h2>
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
              <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 border rounded-lg">
                <div className="flex-1 w-full sm:w-auto">
                  {/* Display product name and SKU from cart item */}
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">SKU: {item.sku}</p> {/* Use item.sku */}
                  <p className="text-sm text-muted-foreground">Type: {item.product_type}</p>
                </div>

                <div className="text-left sm:text-right w-full sm:w-auto">
                  {/* Use item.msrp for price */}
                  <p className="font-medium line-through">${item.msrp.toFixed(2)} each</p>
                  <p className="text-sm text-muted-foreground">
                    Subtotal: ${(item.msrp * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start">
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
                  className="text-red-600 hover:text-red-700 w-full sm:w-auto"
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
            <span className="font-medium">{formatNumber(totalUnits)}</span>
          </div>

          <div className="flex justify-between">
            <span>Total MSRP (before discount):</span>
            <span className="font-medium line-through">${formatCurrency(totalMSRP)}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount:</span>
            <span className="font-medium text-green-600">
              {discountPercentage > 0 ? `${discountPercentage.toFixed(1)}%` : 'N/A'}
            </span>
          </div>

          <Separator />

          <div className="flex justify-between">
            <span>Discounted Unit Price:</span>
            <span className="font-medium">
              {unitPrice > 0 ? `$${formatCurrency(unitPrice)}` : 'N/A'}
            </span>
          </div>

          <div className="flex justify-between text-lg font-bold">
            <span>Discounted Order Total:</span>
            <span className="text-primary">
              {estimatedTotal > 0 ? `$${formatCurrency(estimatedTotal)}` : 'N/A'}
            </span>
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

              {/* Input for City */}
              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <Input
                  required
                  value={clientInfo.city}
                  onChange={(e) => setClientInfo(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Your city"
                />
              </div>

              {/* Input for Phone Number */}
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <Input
                  required
                  value={clientInfo.phone}
                  onChange={(e) => setClientInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Your phone number"
                />
              </div>

            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
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
