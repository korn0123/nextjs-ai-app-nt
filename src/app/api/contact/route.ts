import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { contactSchema } from '@/lib/validations/contact'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'ข้อมูลไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    const { name, email, message } = result.data

    await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: process.env.CONTACT_RECEIVER_EMAIL || 'admin@example.com',
      subject: `New Message from ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
    })

    return NextResponse.json({ success: true, data: {} })
  } catch (error) {
    console.error('[CONTACT_API]', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการส่งข้อความ' },
      { status: 500 }
    )
  }
}
