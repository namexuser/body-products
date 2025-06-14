# Purchase Order Update Plan

This plan outlines the steps to update the purchase order functionality, including allowing custom quantities, verifying inventory updates, displaying discount percentages, and updating the how-to-order section.

## Objectives

1.  Allow buyers to input custom quantities for products (minimum 250 units).
2.  Ensure inventory is correctly updated upon purchase.
3.  Display the calculated discount percentage in the order summary.
4.  Update the How-To-Order section to reflect the unit-based minimum requirement.

## Plan

1.  **Modify Product Catalog Quantity Input:**
    *   Update the quantity input field in [`src/components/ProductCatalog.tsx`](src/components/ProductCatalog.tsx) to allow arbitrary numerical input instead of just steps of 250.
    *   Adjust the `updateQuantity` function to handle arbitrary input while still enforcing a minimum of 250.
    *   Ensure the "Add to Cart" button reflects the user's entered quantity.

2.  **Verify Inventory Update Logic:**
    *   Review the existing inventory update logic in [`supabase/functions/submit-purchase-order/index.ts`](supabase/functions/submit-purchase-order/index.ts) (`lines 103-113`).
    *   Confirm that it correctly decrements the `quantity_in_stock` for each purchased item. (Based on initial review, this logic appears to be in place).

3.  **Implement Discount Percentage Display:**
    *   Modify the `getTieredPricing` function in [`src/context/CartContext.tsx`](src/context/CartContext.tsx) to return the calculated discount percentage based on the total units.
    *   Update the `getCartTotal` function in [`src/context/CartContext.tsx`](src/context/CartContext.tsx) to include the discount percentage in its return value.
    *   Modify [`src/components/Cart.tsx`](src/components/Cart.tsx) to retrieve and display the discount percentage in the Order Summary section.
    *   Adjust the minimum purchase requirement check in [`src/components/Cart.tsx`](src/components/Cart.tsx) (`line 21`) to only consider the total units, removing the `$1000` check.

4.  **Update How-To-Order Content:**
    *   Edit [`src/components/HowToOrder.tsx`](src/components/HowToOrder.tsx) to remove the "$1000 MSRP" minimum requirement mention.
    *   Ensure the text accurately reflects that the minimum is based solely on units.

## Visual Representation

```mermaid
graph TD
    A[User Request] --> B{Analyze Request & Files};
    B --> C[Modify Product Catalog Quantity Input];
    B --> D[Verify Inventory Update Logic];
    B --> E[Implement Discount Percentage Display];
    B --> F[Update How-To-Order Content];
    C --> G[Update ProductCatalog.tsx];
    D --> H[Review submit-purchase-order.ts];
    E --> I[Update CartContext.tsx];
    E --> J[Update Cart.tsx];
    F --> K[Update HowToOrder.tsx];
    G --> L{Plan Complete};
    H --> L;
    I --> L;
    J --> L;
    K --> L;
    L --> M[Present Plan to User];
    M --> N{User Approval?};
    N -- Yes --> O[Ask to Write Plan to File];
    N -- Yes --> P[Switch to Code Mode];
    N -- No --> M;
    O -- Yes --> Q[Write Plan to Markdown];
    Q --> P;
    O -- No --> P;