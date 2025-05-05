
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

interface WebhookPayload {
  user_mobile?: string;
}

serve(async (req) => {
  // Create a Supabase client with the Auth context
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )
  
  try {
    const body: WebhookPayload = await req.json()
    const user_mobile = body.user_mobile
    
    if (!user_mobile) {
      return new Response(
        JSON.stringify({ error: "Missing user_mobile field" }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      )
    }
    
    // We could log this login event to a separate table if needed
    console.log(`User with mobile ${user_mobile} logged in at ${new Date().toISOString()}`)
    
    return new Response(
      JSON.stringify({ success: true, timestamp: new Date().toISOString() }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    )
  } catch (error) {
    console.error('Error in record-user-login function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 400 }
    )
  }
})
