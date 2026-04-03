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

    await supabase.functions.invoke('notify-owner', {
      body: {
        type: 'contact',
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        country: country?.trim() || null,
        company: company?.trim() || null,
        product: product_interest?.trim() || null,
        message: message.trim(),
      },
    })

    return Response.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}