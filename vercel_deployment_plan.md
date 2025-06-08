# Vercel Deployment Plan

## Project Analysis

*   List project dependencies from `package.json`. (Completed)
*   Read `.env` file to identify environment variables. (Completed)
*   Examine `vite.config.ts` for build configurations. (Completed)
*   Inspect `src/integrations/supabase/client.ts` and `supabase/config.toml` for Supabase configuration. (Completed)
*   Analyze `supabase/functions/submit-purchase-order/` for serverless function setup. (Completed)

## Vercel Configuration

*   Create a `vercel.json` file (if it doesn't exist) to define build and routing configurations.
*   Specify environment variables in the Vercel project settings: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `RESEND_API_KEY`.
*   Configure build settings in Vercel to match the `vite.config.ts` file. The build command should be `bun run build`, and the output directory should be `dist`.
*   Add custom domain after testing in staging.

## Supabase Integration

*   Provide instructions for setting up the Supabase project:
    *   Create a new Supabase project in the Supabase dashboard.
    *   Obtain the `SUPABASE_URL` and `SUPABASE_ANON_KEY` from the Supabase project settings.
    *   Enable the `submit-purchase-order` function in the Supabase dashboard.
    *   Configure the `submit-purchase-order` function to use the correct environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `RESEND_API_KEY`).
*   Configure Supabase environment variables in Vercel.
*   Ensure that the Supabase client is correctly initialized in the Vercel environment.

## Serverless Functions

*   Ensure that the serverless functions in `supabase/functions/submit-purchase-order/` are correctly deployed to Vercel. This function handles purchase orders and uses Resend to send confirmation emails.
*   Configure the `RESEND_API_KEY` environment variable for the serverless function in Vercel.

## Testing

*   Test all key functionalities in the Vercel staging environment before adding a custom domain.
*   Verify that database connections, API endpoints, and serverless functions are working correctly.
*   Ensure that email sending via Resend is functioning as expected.
*   Test the purchase order submission process to ensure that it creates a purchase order in Supabase and sends a confirmation email to the customer.

## Documentation

*   Create a detailed README file with instructions for deploying the project to Vercel.
*   Include instructions for configuring environment variables, build settings, and Supabase integration.
*   Add instructions for setting up the Supabase project and configuring the serverless function.
*   Document the steps for adding a custom domain to the Vercel project.

## Mermaid Diagram

```mermaid
graph TD
    A[Project Analysis] --> B{Vercel Configuration};
    B -- Create vercel.json --> C[Supabase Integration];
    C -- Configure Supabase env vars --> D[Serverless Functions];
    D -- Deploy functions --> E[Testing in Staging];
    E -- Verify functionalities --> F[Add Custom Domain];
    F --> G[Documentation];
    G -- Create README --> H[Deployment to Vercel];