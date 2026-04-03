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

    // Notify owner via Edge Function
    await supabase.functions.invoke('notify-owner', {
      body: { type: 'subscriber', email },
    })

    return Response.json({ success: true })
  } catch (err) {
    console.error('Subscribe error:', err)
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}