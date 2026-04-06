import { createClient } from '@/lib/supabase/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const {
      name,
      email,
      phone,
      country,
      company,
      product_interest,
      message,
    } = body

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return Response.json(
        { error: 'Name, email and message are required.' },
        { status: 400 }
      )
    }

    if (!email.includes('@')) {
      return Response.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { error: dbError } = await supabase
      .from('inquiries')
      .insert({
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        country: country?.trim() || null,
        company: company?.trim() || null,
        product_name: product_interest?.trim() || null,
        message: message.trim(),
        status: 'new',
      })

    if (dbError) throw dbError

    // Send Email to Owner using Resend directly
    const resend = new (require('resend').Resend)(process.env.RESEND_API_KEY)
    
    const { error: emailError } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'arham2004i@gmail.com',
      subject: `New Inquiry from ${name.trim()}`,
      html: `
        <h2>New Contact Inquiry</h2>
        <p><strong>Name:</strong> ${name.trim()}</p>
        <p><strong>Email:</strong> ${email.trim()}</p>
        <p><strong>Phone:</strong> ${phone?.trim() || 'N/A'}</p>
        <p><strong>Country:</strong> ${country?.trim() || 'N/A'}</p>
        <p><strong>Company:</strong> ${company?.trim() || 'N/A'}</p>
        <p><strong>Product Interest:</strong> ${product_interest?.trim() || 'N/A'}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap">${message.trim()}</p>
      `
    })

    if (emailError) {
      console.error('Resend email error:', emailError)
      // We still return success:true so the user sees the confirmation card,
      // since their data is already saved to the database.
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}