
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENROUTER_API_KEY = Deno.env.get("openrouter-proxy");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the prompt from the request body
    const { prompt } = await req.json();
    
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Invalid prompt provided');
    }
    
    console.log(`Received prompt: ${prompt.substring(0, 50)}...`);

    // Call the OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://mwap.lovable.dev/',
        'X-Title': 'MWAP Migrant Worker Assistance Program',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo', // You can change this to your preferred model
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant for migrant workers in India. Provide information about government schemes, benefits, legal rights, and services available to them."
          },
          {
            role: "user", 
            content: prompt
          }
        ],
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error response from OpenRouter:', data);
      throw new Error(`OpenRouter API error: ${data.error?.message || 'Unknown error'}`);
    }
    
    // Extract the assistant's message content
    const responseText = data.choices?.[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('No response text received from OpenRouter');
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        response: responseText 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in openrouter-proxy function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'An unknown error occurred'
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
