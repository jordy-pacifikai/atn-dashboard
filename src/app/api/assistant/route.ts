import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appWd0x5YZPHKL0VK'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Simple keyword search in FAQ content
async function searchFAQ(query: string, limit = 5): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('atn_faq_embeddings')
      .select('content')
      .limit(limit)

    if (error || !data) return []

    // Simple relevance scoring based on keyword matches
    const keywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 2)
    const scored = data.map(item => {
      const content = item.content.toLowerCase()
      const score = keywords.reduce((acc, kw) => acc + (content.includes(kw) ? 1 : 0), 0)
      return { content: item.content, score }
    })

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.content)
  } catch {
    return []
  }
}

// Log conversation to Airtable
async function logConversation(session: string, question: string, response: string, responseTime: number, tokens: number) {
  try {
    await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Concierge_Logs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          Session: session,
          Question: question,
          'Réponse': response,
          'Temps (s)': responseTime,
          Tokens: tokens,
          Date: new Date().toISOString(),
        }
      }),
    })
  } catch (error) {
    console.error('Failed to log conversation:', error)
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { message, session_id } = await request.json()

    if (!message) {
      return NextResponse.json({ success: false, error: 'Message required' }, { status: 400 })
    }

    // Search for relevant FAQ content
    const faqResults = await searchFAQ(message)
    const context = faqResults.length > 0
      ? `\n\nInformations pertinentes sur Air Tahiti Nui:\n${faqResults.map((r, i) => `${i + 1}. ${r}`).join('\n')}`
      : ''

    // Call Claude API
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1024,
        system: `Tu es l'assistant IA du dashboard Air Tahiti Nui. Tu aides l'équipe marketing à gérer leurs campagnes, contenus et workflows.

Tu as accès aux informations suivantes sur Air Tahiti Nui:
- Compagnie aérienne internationale de Polynésie française
- Flotte de Boeing 787-9 Dreamliner
- Destinations: Paris, Los Angeles, Tokyo, Auckland, Seattle
- Classes: Poerava Business, Moana Premium, Moana Economy

Si on te pose une question sur les vols, bagages, tarifs, etc., utilise les informations ci-dessous si disponibles.
Réponds de façon concise et professionnelle en français.${context}`,
        messages: [{ role: 'user', content: message }],
      }),
    })

    const claudeData = await claudeResponse.json()
    console.log('Claude response status:', claudeResponse.status)
    console.log('Claude data:', JSON.stringify(claudeData).substring(0, 500))

    if (claudeData.error) {
      console.error('Claude API error:', claudeData.error)
      return NextResponse.json({
        success: false,
        error: claudeData.error.message || 'Claude API error',
        debug: claudeData.error
      }, { status: 500 })
    }

    const responseText = claudeData.content?.[0]?.text || 'Désolé, je n\'ai pas pu traiter votre demande.'
    const tokens = claudeData.usage?.input_tokens + claudeData.usage?.output_tokens || 0

    const responseTime = (Date.now() - startTime) / 1000

    // Log to Airtable (async, don't wait)
    logConversation(session_id || 'dashboard', message, responseText, responseTime, tokens)

    return NextResponse.json({
      success: true,
      response: responseText,
      context_used: faqResults.length > 0,
      response_time: responseTime,
    })
  } catch (error) {
    console.error('Assistant error:', error)
    return NextResponse.json({ success: false, error: 'Assistant failed' }, { status: 500 })
  }
}
