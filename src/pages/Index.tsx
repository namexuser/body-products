
import React, { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import ProductCatalog from '../components/ProductCatalog';
import Cart from '../components/Cart';
import HowToOrder from '../components/HowToOrder';
import AboutUs from '../components/AboutUs';
import ContactUs from '../components/ContactUs';
import { CartProvider } from '../context/CartContext';

const Index = () => {
  const [currentSection, setCurrentSection] = useState('catalog');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sections = [
    { id: 'catalog', label: 'Products', component: ProductCatalog },
    { id: 'cart', label: 'Cart', component: Cart },
    { id: 'how-to-order', label: 'How To Order', component: HowToOrder },
    { id: 'about', label: 'About Us', component: AboutUs },
    { id: 'contact', label: 'Contact Us', component: ContactUs },
  ];

  const CurrentComponent = sections.find(s => s.id === currentSection)?.component || ProductCatalog;

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-primary">Body Product Inventory</h1>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(section.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentSection === section.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-600 hover:text-primary hover:bg-gray-100'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-600 hover:text-primary"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="md:hidden py-4 border-t">
                <nav className="flex flex-col space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        setCurrentSection(section.id);
                        setIsMenuOpen(false);
                      }}
                      className={`px-3 py-2 rounded-md text-sm font-medium text-left transition-colors ${
                        currentSection === section.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-gray-600 hover:text-primary hover:bg-gray-100'
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CurrentComponent />
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600">
              <p>&copy; 2024 Body Product Inventory. All rights reserved.</p>
              <p className="mt-2 text-sm">Professional intermediary body product distribution</p>
            </div>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
};

export default Index;
