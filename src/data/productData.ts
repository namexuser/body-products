
export interface Product {
  id: string;
  productType: string;
  name: string;
  size: string;
  msrp: number;
  itemNumber: string;
  brandWebsiteLink: string;
  scent: string;
}

export const productData: Product[] = [
  {
    id: "prod-001",
    productType: "Lotion",
    name: "Deep Hydration Body Lotion",
    size: "8 oz",
    msrp: 15.00,
    itemNumber: "BH-001",
    brandWebsiteLink: "https://example-brand.com/deep-hydration-lotion",
    scent: "Lavender"
  },
  {
    id: "prod-002",
    productType: "Soap",
    name: "Moisturizing Bar Soap",
    size: "4 oz",
    msrp: 8.50,
    itemNumber: "BS-002",
    brandWebsiteLink: "https://example-brand.com/moisturizing-soap",
    scent: "Eucalyptus"
  },
  {
    id: "prod-003",
    productType: "Scrub",
    name: "Exfoliating Body Scrub",
    size: "6 oz",
    msrp: 22.00,
    itemNumber: "ES-003",
    brandWebsiteLink: "https://example-brand.com/exfoliating-scrub",
    scent: "Citrus"
  },
  {
    id: "prod-004",
    productType: "Lotion",
    name: "Anti-Aging Body Cream",
    size: "12 oz",
    msrp: 35.00,
    itemNumber: "AC-004",
    brandWebsiteLink: "https://example-brand.com/anti-aging-cream",
    scent: "Rose"
  },
  {
    id: "prod-005",
    productType: "Soap",
    name: "Gentle Cleansing Bar",
    size: "3.5 oz",
    msrp: 6.75,
    itemNumber: "GC-005",
    brandWebsiteLink: "https://example-brand.com/gentle-cleansing",
    scent: "Unscented"
  },
  {
    id: "prod-006",
    productType: "Scrub",
    name: "Sugar Body Polish",
    size: "10 oz",
    msrp: 28.00,
    itemNumber: "SP-006",
    brandWebsiteLink: "https://example-brand.com/sugar-polish",
    scent: "Vanilla"
  },
  {
    id: "prod-007",
    productType: "Lotion",
    name: "Intensive Repair Lotion",
    size: "16 oz",
    msrp: 45.00,
    itemNumber: "IR-007",
    brandWebsiteLink: "https://example-brand.com/intensive-repair",
    scent: "Coconut"
  },
  {
    id: "prod-008",
    productType: "Soap",
    name: "Luxury Hand Soap",
    size: "8 oz",
    msrp: 12.00,
    itemNumber: "LH-008",
    brandWebsiteLink: "https://example-brand.com/luxury-hand-soap",
    scent: "Jasmine"
  }
];
