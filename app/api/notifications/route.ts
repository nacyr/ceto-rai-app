import { NextResponse } from 'next/server'
import { supabase } from '@/app/lib/supabase'

// Email configuration
const EMAIL_CONFIG = {
  from: 'noreply@cetorai.org',
  fromName: 'Ceto Rai Humanitarian Foundation'
}

// Helper function to send email (placeholder - integrate with email service)
async function sendEmail(to: string, subject: string, html: string) {
  // In a real implementation, integrate with SendGrid, AWS SES, or similar
  console.log(`Email sent to: ${to}`)
  console.log(`Subject: ${subject}`)
  console.log(`HTML: ${html}`)
  
  // Store notification in database for tracking
  await supabase.from('notifications').insert({
    recipient: to,
    subject,
    content: html,
    type: 'email',
    status: 'sent'
  })
}

// Notification templates
const templates = {
  donationReceipt: (name: string, amount: number, program: string) => ({
    subject: `Thank you for your ${amount.toLocaleString()} donation to ${program}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Thank You for Your Generosity!</h1>
        <p>Dear ${name},</p>
        <p>We are deeply grateful for your donation of <strong>$${amount.toLocaleString()}</strong> to support our ${program} program.</p>
        <p>Your contribution will directly impact the lives of those in need and help us continue our vital humanitarian work.</p>
        <p>You will receive an official receipt for your records.</p>
        <p>With heartfelt appreciation,<br>The Ceto Rai Humanitarian Foundation Team</p>
      </div>
    `
  }),

  volunteerWelcome: (name: string, skills: string[], availability: string) => ({
    subject: 'Welcome to the Ceto Rai Volunteer Team!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to Our Volunteer Team!</h1>
        <p>Dear ${name},</p>
        <p>Thank you for your interest in volunteering with Ceto Rai Humanitarian Foundation!</p>
        <p>We have received your application with the following details:</p>
        <ul>
          <li><strong>Skills:</strong> ${skills.join(', ')}</li>
          <li><strong>Availability:</strong> ${availability}</li>
        </ul>
        <p>Our team will review your application and contact you within 3-5 business days with next steps.</p>
        <p>Together, we can make a difference!</p>
        <p>Best regards,<br>The Ceto Rai Humanitarian Foundation Team</p>
      </div>
    `
  }),

  volunteerApproved: (name: string) => ({
    subject: 'Your Volunteer Application Has Been Approved!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Congratulations!</h1>
        <p>Dear ${name},</p>
        <p>We are thrilled to inform you that your volunteer application has been approved!</p>
        <p>You are now part of our dedicated team of volunteers working to make a positive impact in our community.</p>
        <p>Our volunteer coordinator will reach out to you within 48 hours with information about upcoming opportunities and how you can get started.</p>
        <p>Welcome aboard!</p>
        <p>With excitement,<br>The Ceto Rai Humanitarian Foundation Team</p>
      </div>
    `
  }),

  donationUpdate: (name: string, status: string) => ({
    subject: 'Update on Your Donation Status',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Donation Status Update</h1>
        <p>Dear ${name},</p>
        <p>We wanted to keep you updated on the status of your recent donation.</p>
        <p><strong>Current Status:</strong> ${status}</p>
        <p>Thank you for your patience and support. We will continue to keep you informed of any changes.</p>
        <p>Best regards,<br>The Ceto Rai Humanitarian Foundation Team</p>
      </div>
    `
  }),

  impactReport: (name: string, program: string, impact: string) => ({
    subject: `Your Impact: ${program} Program Update`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Your Impact Report</h1>
        <p>Dear ${name},</p>
        <p>We wanted to share the incredible impact your support has made through our ${program} program.</p>
        <p><strong>Impact Highlights:</strong></p>
        <p>${impact}</p>
        <p>Your generosity is transforming lives and creating lasting change in our community.</p>
        <p>Thank you for being part of this journey!</p>
        <p>With gratitude,<br>The Ceto Rai Humanitarian Foundation Team</p>
      </div>
    `
  })
}

export async function POST(request: Request) {
  try {
    const { type, recipient, data } = await request.json()

    if (!type || !recipient) {
      return NextResponse.json({ error: 'Type and recipient are required' }, { status: 400 })
    }

    const template = templates[type as keyof typeof templates]
    if (!template) {
      return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 })
    }

    const { subject, html } = template(data.name, data.amount, data.program, data.skills, data.availability, data.status, data.impact)
    
    await sendEmail(recipient, subject, html)

    return NextResponse.json({ success: true, message: 'Notification sent successfully' })
  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

// Get notification history
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const recipient = searchParams.get('recipient')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase.from('notifications').select('*').order('created_at', { ascending: false })

    if (recipient) {
      query = query.eq('recipient', recipient)
    }

    if (type) {
      query = query.eq('type', type)
    }

    query = query.limit(limit)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}