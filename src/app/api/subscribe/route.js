import { createClient } from '@/lib/supabase/server'

export async function POST(req) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return Response.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Save to subscribers table
    const { error: dbError } = await supabase
      .from('subscribers')
      .insert({ email })

    if (dbError) {
      if (dbError.code === '23505') {
        return Response.json(
          { error: 'This email is already subscribed.' },
          { status: 409 }
        )
      }
      throw dbError
    }

    // Notify owner via Resend directly
    const resend = new (require('resend').Resend)(process.env.RESEND_API_KEY)
    
    const { error: emailError } = await resend.emails.send({
      from: 'info@themaker-tm.com',
      to: 'info@themaker-tm.com',
      subject: `New Newsletter Subscriber!`,
      html: `
        <h2>New Subscriber</h2>
        <p>A new user has subscribed to the newsletter:</p>
        <p><strong>Email:</strong> ${email.trim()}</p>
      `
    })

    if (emailError) {
      console.error('Resend subscribe email error:', emailError)
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('Subscribe error:', err)
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}