# Body Biz Orderflow

## Project Overview

This document provides a comprehensive overview of the Off-Price Pro web application, including instructions for setting up the development environment and deploying the application.

Off-Price Pro is a modern web application designed to streamline the process of browsing products, managing a shopping cart, and submitting purchase orders. It provides a user-friendly interface for viewing a product catalog, adding items to a cart, and submitting the order details for processing. The application leverages a robust stack of technologies to ensure performance, scalability, and ease of maintenance.

## Key Technologies

The application leverages the following key technologies:

*   **Frontend:** React with Vite
*   **Styling:** Tailwind CSS
*   **UI Components:** Shadcn UI
*   **Database & Backend:** [Supabase](https://supabase.io/) (PostgreSQL, Authentication, Edge Functions)
*   **Email Service:** [Resend](https://resend.com/)

## Setup Instructions

To set up the project locally for development:

### Prerequisites

Ensure you have the following installed on your machine:

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [npm](https://www.npmjs.com/)
*   [Git](https://git-scm.com/)

### Installation

1.  Clone the repository:
    ```bash
    git clone [repository URL]
    cd [project directory]
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Environment Variables

The application requires specific environment variables to connect to external services. Create a file named `.env` in the root of the project directory.

Copy the contents of the `.env.example` file (if available, otherwise create it manually) and fill in the required values. You will need credentials for your Supabase and Resend accounts.

```dotenv
# Supabase
VITE_SUPABASE_URL=[Your Supabase Project URL]
VITE_SUPABASE_ANON_KEY=[Your Supabase Project Anon Key]
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
npm run dev
```

This will start the development server, usually accessible at `http://localhost:8080` (Vite default port).

## Deployment

The application is typically deployed using a platform like [Vercel](https://vercel.com/) or Netlify.

1.  Connect your Git repository to your hosting provider.
2.  Configure the build settings (usually `npm run build` or `vite build`).
3.  Configure production environment variables in your hosting provider's settings.
4.  Push your changes to the main branch of your Git repository to trigger a deployment.

## Support and Contact Information

If you encounter any issues or require support, please contact:

Kealeboga Eugene Ratshipa/Ingenuity Earth
kealebogaratshipa@gmail.com
