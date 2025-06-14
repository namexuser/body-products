import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'https://esm.sh/resend@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

interface ContactSubmissionRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    const { name, email, subject, message }: ContactSubmissionRequest =
      await req.json();

    console.log('Processing contact form submission from:', email);

    // Insert submission into contact_submissions table
    const { data: submissionData, error: submissionError } = await supabaseClient
      .from('contact_submissions')
      .insert({
        name: name,
        email: email,
        subject: subject,
        message: message,
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Error saving contact submission:', submissionError);
      throw new Error(`Failed to save contact submission: ${submissionError.message}`);
    }

    console.log('Contact submission saved:', submissionData.id);

    // Send email to the client
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">New Contact Form Submission</h1>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Submission Details</h2>
          <p><strong>Submission ID:</strong> ${submissionData.id}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Submission Date:</strong> ${new Date(submissionData.submission_date).toLocaleString()}</p>
        </div>

        <h3 style="color: #333;">Message:</h3>
        <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin: 20px 0; background: #fff;">
          <p style="margin: 0;">${message}</p>
        </div>

        <p style="text-align: center; color: #666; margin-top: 30px;">
          Body Product Inventory Team
        </p>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // You might want a different 'from' address
      to: ['012009@gmail.com'], // Send to the client's email address
      subject: `New Contact Form Submission - ${subject}`,
      html: emailHtml,
    });

    console.log('Contact form email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        submissionId: submissionData.id,
        message: 'Contact form submitted successfully!',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error in submit-contact-form function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);