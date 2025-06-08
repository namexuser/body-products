
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
      description: "Ensure your order meets the minimum purchase requirement of $1,000 MSRP to qualify for our wholesale pricing."
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
    { range: "$1,000 - $2,999", unitPrice: "$3.95", minUnits: "253+" },
    { range: "$3,000 - $4,999", unitPrice: "$3.25", minUnits: "923+" },
    { range: "$5,000 - $9,999", unitPrice: "$2.80", minUnits: "1,786+" },
    { range: "$10,000+", unitPrice: "$2.40", minUnits: "4,166+" }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">How To Order</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Follow these simple steps to place your wholesale body product order with us.
        </p>
      </div>

      {/* Ordering Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Step-by-Step Ordering Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
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
                  <th className="text-left py-3 px-4">Order Value (MSRP)</th>
                  <th className="text-left py-3 px-4">Unit Price</th>
                  <th className="text-left py-3 px-4">Minimum Units</th>
                </tr>
              </thead>
              <tbody>
                {pricingTiers.map((tier, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 font-medium">{tier.range}</td>
                    <td className="py-3 px-4 text-primary font-semibold">{tier.unitPrice}</td>
                    <td className="py-3 px-4">{tier.minUnits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            * Pricing is based on total MSRP value of your order. Final pricing subject to availability and confirmation.
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
            <div className="flex items-start space-x-3">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              <p><strong>Minimum Order:</strong> $1,000 MSRP value required for all wholesale orders.</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              <p><strong>Product Images:</strong> All product photos and detailed descriptions are available on the respective brand websites linked from each product.</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              <p><strong>Availability:</strong> Product availability is subject to manufacturer stock levels and will be confirmed upon order review.</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              <p><strong>Payment Terms:</strong> Payment terms and methods will be provided upon order confirmation.</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              <p><strong>Shipping:</strong> Shipping costs calculated based on order size, weight, and destination. Free shipping may be available for large orders.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HowToOrder;
