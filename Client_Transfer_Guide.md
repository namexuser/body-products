# Website Ownership Transfer Guide

This document provides a comprehensive, step-by-step guide for transferring full ownership of the Body Biz Orderflow website and its associated infrastructure.

**Components to Transfer:**

1.  **Domain Name:** The web address used to access the website.
2.  **Hosting:** The service that stores the website files and makes them accessible online.
3.  **Website Files:** The source code and assets of the website.
4.  **Database:** The Supabase project storing product information, orders, and other data.
5.  **Associated Accounts:** Accounts for services like Supabase, Resend (for emails), and potentially hosting providers (like Vercel).

---

## Step 1: Domain Name Transfer

Transferring the domain name involves changing the registrar (the company where the domain was purchased) or updating the DNS records to point to the new hosting.

1.  **Obtain Authorization Code (EPP Code):** The current domain owner needs to obtain the Authorization Code (also known as an EPP Code or Transfer Key) from their current domain registrar. This code is required to authorize the transfer.
2.  **Unlock the Domain:** Ensure the domain is unlocked for transfer at the current registrar.
3.  **Initiate Transfer at New Registrar:** The new owner initiates a domain transfer with their chosen domain registrar. They will need the domain name and the Authorization Code.
4.  **Approve the Transfer:** The current owner will receive an email requesting approval for the transfer. They must approve this request.
5.  **Monitor Transfer Progress:** The transfer process can take typically 5-7 days to complete. Both parties can monitor the status through their respective registrar accounts.
6.  **Update DNS Records (if necessary):** Once the domain is transferred, update the DNS records at the new registrar to point to the website's hosting server (see Step 2). This usually involves updating A records and CNAME records.

---

## Step 2: Hosting Transfer

Transferring hosting involves moving the website files to the new owner's hosting provider and configuring it.

1.  **Choose a Hosting Provider:** The new owner selects a hosting provider (e.g., Vercel, Netlify, AWS, etc.).
2.  **Set up New Hosting Account:** The new owner creates an account and sets up a hosting service capable of running a React/Vite application.
3.  **Transfer Website Files:**
    *   The current owner provides the complete website source code files (typically via a Git repository like GitHub, GitLab, or a compressed archive).
    *   The new owner obtains the files and deploys them to their new hosting environment. This may involve cloning a Git repository, uploading files via FTP/SFTP, or using a hosting provider's deployment tools.
4.  **Configure Environment Variables:** Set up the necessary environment variables on the new hosting platform. These include sensitive keys and URLs required for the application to connect to the database and other services. Refer to the `.env` file structure for required variables (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `RESEND_API_KEY`).
5.  **Point Domain to New Hosting:** Update the DNS records at the domain registrar (Step 1.6) to point to the IP address or nameservers provided by the new hosting provider.

---

## Step 3: Database Transfer (Supabase)

Transferring the Supabase database involves transferring ownership of the Supabase project.

1.  **Transfer Supabase Project Ownership:** The current owner initiates a project transfer within the Supabase dashboard. They will need the email address of the new owner's Supabase account.
2.  **New Owner Accepts Transfer:** The new owner accepts the project transfer invitation in their Supabase account.
3.  **Update Environment Variables:** Ensure the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables in the hosting configuration (Step 2.4) are correct for the transferred Supabase project.

---

## Step 4: Associated Accounts Transfer

Transferring associated accounts ensures continuity of services used by the website.

1.  **Resend Account (for Emails):**
    *   Transfer ownership of the Resend account or provide the new owner with the necessary API key.
    *   If a new Resend account is created, update the `RESEND_API_KEY` environment variable in the hosting configuration (Step 2.4).
    *   Ensure the sending domain is verified in the new Resend account.
2.  **Other Accounts:** Identify and transfer ownership or provide access to any other third-party service accounts used by the website (e.g., analytics, monitoring, etc.).

---

## Step 5: Verification and Testing

After completing the transfers, thoroughly test the website in the new environment.

1.  **Verify Website Access:** Ensure the website is accessible via the domain name.
2.  **Test All Features:** Test all functionalities, including:
    *   Product browsing, filtering, and search.
    *   Adding items to the cart and managing quantities.
    *   Submitting a purchase order.
    *   Using the contact form.
    *   (If applicable) Receiving order confirmation emails.
3.  **Check Database Connection:** Verify that the website is correctly reading from and writing to the transferred Supabase database.
4.  **Monitor Logs:** Check hosting and Supabase logs for any errors.

---

## Important Considerations:

*   **Downtime:** Plan the transfer process to minimize potential website downtime. Performing the transfer during low-traffic periods is recommended.
*   **Backups:** Ensure full backups of the website files and database are created before initiating any transfers.
*   **Documentation:** Provide the new owner with any existing documentation regarding the website's structure, dependencies, and configuration.
*   **Support:** Agree on the level of support the current owner will provide during and after the transfer process.

This guide provides a general framework. Specific steps may vary slightly depending on the chosen hosting provider, domain registrar, and other services.