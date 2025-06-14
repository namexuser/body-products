
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const HowToOrder = () => {
  const steps = [
    {
      title: "Browse Product Catalog",
      description: "Explore our extensive collection of body care products. Use filters to find products by type, scent, or search by name/SKU."
    },
    {
      title: "View Product Details",
      description: "Click 'View Full Details & Photo on Brand Website' to see high-resolution images and detailed product information on the manufacturer's official website."
    },
    {
      title: "Add Items to Cart",
      description: "Select quantities and add desired products to your cart. You can adjust quantities at any time before submitting your order."
    },
    {
      title: "Review Cart & Pricing",
      description: "Visit your cart to review all items. Our tiered pricing system automatically calculates your estimated total based on order volume."
    },
    {
      title: "Meet Minimum Requirements",
      description: "Ensure your order meets the minimum purchase requirement of 250 units to qualify for our wholesale pricing."
    },
    {
      title: "Submit Order Request",
      description: "Fill in your contact information and submit your purchase order request. This is not a final purchase but a request for quotation."
    },
    {
      title: "Order Confirmation",
      description: "We will review your request and contact you within 24-48 hours to confirm availability, final pricing, and payment terms."
    },
    {
      title: "Payment & Fulfillment",
      description: "Upon confirmation, we'll provide payment instructions. Orders are typically processed and shipped within 3-5 business days after payment."
    }
  ];

  const pricingTiers = [
    { range: "250+ Units", discount: "73.5%", formula: "(MSRP/100*26.5)" },
    { range: "900+ Units", discount: "78%", formula: "(MSRP/100*22)" },
    { range: "1800+ Units", discount: "81%", formula: "(MSRP/100*19)" },
    { range: "4000+ Units", discount: "84%", formula: "(MSRP/100*16)" }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">How to Place Your Order</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Follow these steps to place your purchase order with us.
        </p>
      </div>

      {/* Ordering Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Ordering Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Explore Products</h3>
                <p className="text-muted-foreground">Browse our product catalog and choose items by viewing details. Use filters for type or scent, or search by name/SKU.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Add to Cart</h3>
                <p className="text-muted-foreground">Select quantities and add products to your cart. Adjust quantities anytime before submitting.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Review Cart & Pricing</h3>
                <p className="text-muted-foreground">Check your cart to confirm items. Ensure your order meets the minimum requirement of 250 units. Our tiered pricing adjusts your estimated total based on order size.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Submit Order</h3>
                <p className="text-muted-foreground">Enter your contact details and submit your purchase order request.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                5
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Confirmation & Fulfillment</h3>
                <p className="text-muted-foreground">We’ll review your request and contact you within 24-48 hours to confirm. Once confirmed, we’ll provide payment and pickup/shipping details. Orders are typically fulfilled within 2 business days.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Tiers */}
      <Card>
        <CardHeader>
          <CardTitle>Wholesale Pricing Tiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Minimum Units</th>
                  <th className="text-left py-3 px-4">Discount</th>
                  <th className="text-left py-3 px-4">Formula</th>
                </tr>
              </thead>
              <tbody>
                {pricingTiers.map((tier, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 font-medium">{tier.range}</td>
                    <td className="py-3 px-4 text-primary font-semibold">{tier.discount}</td>
                    <td className="py-3 px-4">{tier.formula}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            * Pricing is based on total units of your order. Final pricing subject to availability and confirmation. Discounts are not guaranteed until paid.
          </p>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-3">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              <p><strong>Minimum Order:</strong> 250 Units minimum required for all purchase orders.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-3">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              <p><strong>Availability:</strong> Product availability is not guaranteed until paid.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-3">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              <p><strong>Payment:</strong> USDC w/0.5% fee, Credit Card w/3% fee, ACH, Cash, Zelle.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-3">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              <p><strong>Shipping:</strong> If shipping is requested cost is calculated based on order size and destination.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HowToOrder;
