import { supabase } from '@/app/lib/supabase'

export async function sendEmailNotification(
  userId: string,
  subject: string,
  message: string
) {
  const { data: { user } } = await supabase.auth.admin.getUserById(userId)
  
  // Implementation would connect to your email service
  // For now, we'll just log it
  console.log(`Email to ${user?.email}: ${subject} - ${message}`)
}
