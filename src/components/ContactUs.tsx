import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client'; // Import supabase client

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

// Simple email validation regex
const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the submit-contact-form Edge Function
      const { data, error } = await supabase.functions.invoke('submit-contact-form', {
        body: formData, // Send form data as the body
      });

      if (error) {
        console.error('Error submitting contact form:', error);
        throw new Error(error.message || 'Failed to send message');
      }

      if (data?.success) {
        toast.success('Message sent successfully! We will get back to you within 24 hours.');
        setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form on success
      } else {
        throw new Error(data?.error || 'Failed to send message');
      }
    } catch (error: unknown) {
      console.error('Error submitting contact form:', error);
      toast.error((error instanceof Error ? error.message : 'Unknown error') || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "sales@bodyproductinventory.com",
      description: "Send us an email anytime"
    },
    {
      icon: Phone,
      title: "Phone",
      details: "(555) 123-4567",
      description: "Monday to Friday, 9AM to 6PM EST"
    },
    {
      icon: MapPin,
      title: "Address",
      details: "123 Business Plaza, Suite 456",
      description: "Your City, State 12345"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Monday - Friday: 9AM - 6PM EST",
      description: "Weekend: By appointment only"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">Contact Us</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          If you have questions or you need assistance with your order we're here to help!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send Us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <Input
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message *</label>
                <Textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell us how we can help you..."
                  rows={6}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <h3 className="font-semibold">Get in Touch</h3>
                <p className="text-primary font-medium">Phone 305 747 1297</p>
                <h3 className="font-semibold">Business Hours</h3>
                <p className="text-primary font-medium">Monday to Friday, 10AM to 5PM EST</p>
                <p className="text-sm text-muted-foreground">Weekend: By appointment only</p>
                <h3 className="font-semibold">Mailing Address</h3>
                <p className="text-primary font-medium">Off-Price Pro</p>
                <p className="text-primary font-medium">78 SW 7th Street, Miami, FL 33130</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What is the minimum order amount?</h4>
                  <p className="text-sm text-muted-foreground">Our minimum order requirement is 250 Units.</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">How long does order processing take?</h4>
                  <p className="text-sm text-muted-foreground">Orders are typically processed within 2-5 business days. Same day delivery is available.</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Do you ship internationally?</h4>
                  <p className="text-sm text-muted-foreground">Contact us for international shipping inquiries.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
