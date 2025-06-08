# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/657d02ec-d922-43a5-991d-68ee7cf6f966

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/657d02ec-d922-43a5-991d-68ee7cf6f966) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
bun install

# Step 4: Start the development server with auto-reloading and an instant preview.
bun run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- Radix UI (shadcn-ui)
- Tailwind CSS
- Supabase
- Zod
- React Hook Form
- Lucide React
- Next Themes
- Tanstack React Query

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/657d02ec-d922-43a5-991d-68ee7cf6f966) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Vercel Deployment Configuration

To ensure a successful deployment to Vercel, follow these steps:

1.  **Set up Environment Variables:**
    *   In your Vercel project settings, add the following environment variables:
        *   `VITE_SUPABASE_URL`: Your Supabase project URL.
        *   `VITE_SUPABASE_ANON_KEY`: Your Supabase project anon key.
        *   `RESEND_API_KEY`: Your Resend API key.

2.  **Configure Build Settings:**
    *   In your Vercel project settings, ensure that the build command is set to `bun run build` and the output directory is set to `dist`.

## Supabase Setup

1.  **Create a Supabase Project:**
    *   Go to the [Supabase website](https://supabase.com/) and create a new project.
    *   Obtain the `SUPABASE_URL` and `SUPABASE_ANON_KEY` from the project settings.

2.  **Enable the `submit-purchase-order` Function:**
    *   In the Supabase dashboard, enable the `submit-purchase-order` function.

3.  **Configure the `submit-purchase-order` Function:**
    *   In your Vercel project settings, navigate to the `submit-purchase-order` function.
    *   Add the following environment variable:
        *   `RESEND_API_KEY`: Your Resend API key.

## Custom Domain

After testing in the staging environment, you can add your own domain to the Vercel project.

## Contribution Guidelines

We welcome contributions to this project! If you'd like to contribute, please follow these guidelines:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear, concise messages.
4.  Test your changes thoroughly.
5.  Submit a pull request.

Please ensure that your code follows the project's coding standards and that you include appropriate tests.
