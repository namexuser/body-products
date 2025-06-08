
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShieldCheck, Truck, HeartHandshake } from 'lucide-react';

const AboutUs = () => {
  const features = [
    {
      icon: Users,
      title: "Trusted Intermediary",
      description: "We serve as a reliable bridge between premium body care manufacturers and retailers, ensuring smooth transactions and quality service."
    },
    {
      icon: ShieldCheck,
      title: "Quality Assurance",
      description: "All products in our catalog are sourced directly from reputable manufacturers and meet the highest quality standards."
    },
    {
      icon: Truck,
      title: "Efficient Distribution",
      description: "Our streamlined distribution network ensures timely delivery of your orders with careful handling and packaging."
    },
    {
      icon: HeartHandshake,
      title: "Customer Focused",
      description: "We prioritize building long-term relationships with our clients through personalized service and competitive pricing."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">About Us</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your trusted partner in wholesale body care product distribution.
        </p>
      </div>

      {/* Main Description */}
      <Card>
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p className="text-muted-foreground leading-relaxed mb-4">
            We are a professional intermediary specializing in the wholesale distribution of premium body care products. 
            Our role is to connect retailers, spas, salons, and other businesses with high-quality body care manufacturers, 
            providing a streamlined ordering process and competitive wholesale pricing.
          </p>
          
          <p className="text-muted-foreground leading-relaxed mb-4">
            Rather than maintaining our own product lines, we focus on what we do best: facilitating efficient 
            transactions between buyers and established manufacturers. This approach allows us to offer a diverse 
            catalog of products while ensuring that our clients receive authentic products directly from trusted sources.
          </p>
          
          <p className="text-muted-foreground leading-relaxed">
            Our commitment is to transparency, quality, and service excellence. We handle the logistics, 
            pricing negotiations, and order coordination so our clients can focus on growing their businesses 
            and serving their customers.
          </p>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <feature.icon className="text-primary" size={24} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Business Model */}
      <Card>
        <CardHeader>
          <CardTitle>Our Business Model</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Intermediary Distribution</h3>
              <p className="text-muted-foreground">
                We operate as an intermediary between manufacturers and retailers, facilitating wholesale transactions 
                without holding extensive inventory. This model allows us to offer competitive pricing and diverse product selections.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Direct Brand Partnerships</h3>
              <p className="text-muted-foreground">
                All product information, images, and detailed descriptions are sourced directly from manufacturer websites. 
                This ensures accuracy and respect for intellectual property while providing clients with the most up-to-date product information.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Volume-Based Pricing</h3>
              <p className="text-muted-foreground">
                Our tiered pricing structure rewards larger orders with better per-unit pricing, making it advantageous 
                for businesses to consolidate their body care product needs through our platform.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Ready to start your wholesale body care product journey with us? We're here to help you find the right 
            products for your business at competitive wholesale prices.
          </p>
          <p className="text-muted-foreground">
            Browse our product catalog, create your first order, or contact us with any questions. We look forward 
            to building a successful partnership with your business.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutUs;
