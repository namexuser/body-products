# Body Biz Orderflow

## Project Overview

This document provides a comprehensive overview of the Body Biz Orderflow web application, including instructions for setting up the development environment, deploying the application, and transferring ownership of the project infrastructure.

Body Biz Orderflow is a modern web application designed to streamline the process of browsing products, managing a shopping cart, and submitting purchase orders. It provides a user-friendly interface for viewing a product catalog, adding items to a cart, and submitting the order details for processing. The application leverages a robust stack of technologies to ensure performance, scalability, and ease of maintenance.

## Key Technologies

The application leverages the following key technologies:

*   **Frontend Hosting:** [Vercel](https://vercel.com/) - Used for hosting the frontend application, providing features like automatic deployments from Git repositories, serverless functions, and a global edge network.
*   **Database & Backend:** [Supabase](https://supabase.io/) - Provides a PostgreSQL database, authentication, and serverless functions (Edge Functions) for the application's backend needs.
*   **Email Service:** [Resend](https://resend.com/) - Utilized for sending transactional emails from the application.

## Setup Instructions

To set up the project locally for development:

### Prerequisites

Ensure you have the following installed on your machine:

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) or [Bun](https://bun.sh/) (Bun is used in this project based on `bun.lockb`)
*   [Git](https://git-scm.com/)

### Installation

1.  Clone the repository:
    ```bash
    git clone [repository URL]
    cd [project directory]
    ```
2.  Install dependencies:
    ```bash
    bun install
    ```

### Environment Variables

The application requires specific environment variables to connect to external services. Create a file named `.env` in the root of the project directory.

Copy the contents of the `.env.example` file (if available, otherwise create it manually) and fill in the required values. You will need credentials for your Supabase and Resend accounts.

```dotenv
# Supabase
SUPABASE_URL=[Your Supabase Project URL]
SUPABASE_ANON_KEY=[Your Supabase Project Anon Key]
SUPABASE_SERVICE_ROLE_KEY=[Your Supabase Project Service Role Key - Use with caution, especially in serverless functions]

# Resend
RESEND_API_KEY=[Your Resend API Key]

# Other variables (if any)
# [OTHER_VARIABLE_NAME]=[value]
```

**Important:** Do not commit your `.env` file to version control. The `.gitignore` file should already include `.env` to prevent this.

### Running Locally

To run the application locally:

```bash
bun run dev
```

This will start the development server, usually accessible at `http://localhost:3000`.

## Deployment

The application is configured for continuous deployment with [Vercel](https://vercel.com/).

1.  Push your changes to the main branch of your Git repository.
2.  Vercel will automatically detect the changes and build/deploy the application.

Ensure your environment variables are configured correctly in your Vercel project settings.

## Project Transfer Guide

This guide provides step-by-step instructions for transferring ownership and control of the project infrastructure to the client. This process involves moving services to your own accounts to ensure full control and billing management.

**Important:** This guide assumes you have created accounts with Vercel, Supabase, and Resend.

### Introduction

Transferring a project involves moving the hosting, database, and email services to your own accounts. This gives you complete control over the infrastructure, billing, and configurations. Follow these steps carefully.

### Step 1: Vercel Project Transfer

The Vercel project hosts the frontend application and handles automatic deployments.

1.  **Accept the Transfer:** The current owner will initiate a project transfer to your Vercel account. You will receive an email invitation to accept the transfer. Click the link in the email and follow the prompts on Vercel to accept the project.
2.  **Verify Project Settings:** Once transferred, log in to your Vercel dashboard and navigate to the transferred project. Verify the build and deployment settings, ensuring they are configured correctly for your repository.
3.  **Configure Environment Variables:** Go to the project settings in Vercel and navigate to the "Environment Variables" section. Add or update the environment variables listed in the `.env` section of this README with your new Supabase and Resend credentials (obtained in the following steps). Ensure these variables are configured for the appropriate environments (e.g., Production, Preview, Development).

### Step 2: Supabase Database Transfer/Migration

Supabase provides the application's database and backend functions. Transferring a Supabase project directly between accounts is not a standard feature. The recommended approach is to migrate your database to a new project under your account.

1.  **Create a New Supabase Project:** Log in to your Supabase dashboard and create a new project in your organization. Choose the region and database password.
2.  **Obtain Database Dump:** The current owner will need to provide you with a database dump (a file containing the database schema and data) from their Supabase project. This can typically be done via the Supabase dashboard or command-line tools.
3.  **Restore Database Dump:** In your new Supabase project, use the database tools (e.g., `psql` command-line client or a GUI tool like DBeaver) to connect to your new database and restore the database dump provided by the previous owner. This will recreate the tables, data, and any functions or triggers.
4.  **Transfer Supabase Functions (Edge Functions):** If the project uses Supabase Edge Functions (like the `submit-purchase-order` function in this project), you will need to deploy these functions to your new Supabase project. The source code for these functions is located in the `supabase/functions` directory. Use the Supabase CLI to link your local project to your new Supabase project and deploy the functions.
    ```bash
    # Install Supabase CLI if you haven't already
    # npm install -g supabase-cli

    # Link your local project to your new Supabase project
    supabase link --project-ref [your-new-project-ref]

    # Deploy the functions
    supabase functions deploy
    ```
5.  **Update Environment Variables:** Obtain the new `SUPABASE_URL` and `SUPABASE_ANON_KEY` from your new Supabase project settings (under Project Settings -> API). Update these values in your Vercel environment variables (Step 1.3) and your local `.env` file (Setup Instructions -> Environment Variables).

### Step 3: Resend Email Service Reconfiguration

Resend handles sending emails from the application. You will need to configure this with your own Resend account.

1.  **Create a Resend Account and API Key:** Log in to your Resend dashboard and create a new API Key. Make sure to grant it the necessary permissions (at least "Send").
2.  **Verify Your Domain:** Add and verify the domain you will be sending emails from within your Resend account settings. Follow Resend's instructions for adding DNS records.
3.  **Update Environment Variables:** Obtain your new Resend API Key. Update the `RESEND_API_KEY` environment variable in your Vercel project settings (Step 1.3) and your local `.env` file (Setup Instructions -> Environment Variables).

### Step 4: Updating Environment Variables

As highlighted in the previous steps, updating environment variables is crucial after transferring services.

*   **Vercel:** Log in to your Vercel dashboard, navigate to the project settings, and update the environment variables with your new Supabase and Resend credentials.
*   **Local Development:** Update the `.env` file in the root of your local project directory with your new credentials.

After updating environment variables in Vercel, trigger a new deployment (e.g., by making a small change and pushing to your Git repository) to ensure the changes take effect in the deployed application.

## Support and Contact Information

If you encounter any issues or require support, please contact:

Kealeboga Eugene Ratshipa/Ingenuity Earth
kealebogaratshipa@gmail.com


We are committed to ensuring a smooth transition and successful operation of the application.
