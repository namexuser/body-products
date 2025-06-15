import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const [customerName, setCustomerName] = useState('Customer'); // Default name

  useEffect(() => {
    // Extract customer name from state passed during navigation
    if (location.state && location.state.customerName) {
      setCustomerName(location.state.customerName);
    }
  }, [location.state]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Order Confirmation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg">
            Hi {customerName},
          </p>
          <p>
            Thank you for your order with OffPrice.Pro!
          </p>
          <p>
            We’ve received your purchase order and are excited to work on it. You will receive a copy of your order by email if not, check your spam folder.
          </p>

          <Separator />

          <h3 className="text-xl font-semibold">What Happens Next</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Order Review</h4>
              <p className="text-muted-foreground">Our team is reviewing your order to confirm all details.</p>
            </div>
            <div>
              <h4 className="font-medium">Same-Day Confirmation</h4>
              <p className="text-muted-foreground">We’ll reach out today to confirm payment and finalize shipping or pickup arrangements.</p>
            </div>
            <div>
              <h4 className="font-medium">Fulfillment & Delivery</h4>
              <p className="text-muted-foreground">Once confirmed, we’ll begin processing your order right away so you can receive your goods quickly.</p>
            </div>
          </div>

          <Separator />

          <p>
            If you have any questions or need to make changes, feel free to reply to this email or <Link to="/contact-us" className="text-primary hover:underline">contact us</Link>.
          </p>

          <p className="text-center text-lg font-semibold mt-8">
            Thanks again for choosing Off-Price Pro
          </p>

          <div className="text-center">
            <Link to="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderConfirmation;