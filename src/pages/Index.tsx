import React, { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import ProductCatalog from '../components/ProductCatalog';
import Cart from '../components/Cart';
import HowToOrder from '../components/HowToOrder';
import ContactUs from '../components/ContactUs';
import { CartProvider, useCart } from '../context/CartContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../components/ui/sheet';

const Index = () => {
  const [currentSection, setCurrentSection] = useState('catalog');
  const sections = [
    { id: 'catalog', label: 'Products', component: ProductCatalog },
    { id: 'cart', label: 'Cart', component: Cart },
    { id: 'how-to-order', label: 'How To Order', component: HowToOrder },
    { id: 'contact', label: 'Contact Us', component: ContactUs },
  ];

  return (
    <CartProvider>
      <AppContent currentSection={currentSection} setCurrentSection={setCurrentSection} sections={sections} />
    </CartProvider>
  );
};

const AppContent = ({ currentSection, setCurrentSection, sections }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const CurrentComponent = sections.find(s => s.id === currentSection)?.component || ProductCatalog;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">Product Inventory</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8 items-center">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(section.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentSection === section.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-100'
                  } ${section.id === 'cart' ? 'relative' : ''}`}
                >
                  {section.label}
                  {section.id === 'cart' && itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <div className="md:hidden flex items-center">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    className="text-gray-600 hover:text-primary relative"
                  >
                    <Menu size={24} />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Navigation</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col space-y-4 mt-4">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => {
                          setCurrentSection(section.id);
                          setIsMenuOpen(false);
                        }}
                        className={`text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                          currentSection === section.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-gray-600 hover:text-primary hover:bg-gray-100'
                        }`}
                      >
                        {section.label}
                      </button>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16">
        <CurrentComponent />
      </main>

      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Body Product Inventory</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
