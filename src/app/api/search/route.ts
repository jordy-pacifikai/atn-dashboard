import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBJia0MZzP9JqCD9PoBe7M8MwpRXrCwjjQ'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Generate embedding using Google Gemini
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/text-embedding-004',
        content: { parts: [{ text }] },
      }),
    }
  )

  const data = await response.json()
  return data.embedding?.values || []
}

export async function POST(request: NextRequest) {
  try {
    const { query, limit = 5 } = await request.json()

    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 })
    }

    // Generate embedding for the query
    const embedding = await generateEmbedding(query)

    if (embedding.length === 0) {
      return NextResponse.json({ error: 'Failed to generate embedding' }, { status: 500 })
    }

    // Search in Supabase using vector similarity
    const { data, error } = await supabase.rpc('match_atn_faq', {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: limit,
    })

    if (error) {
      // Fallback: simple text search if RPC doesn't exist
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('atn_faq_embeddings')
        .select('content')
        .textSearch('content', query.split(' ').join(' | '))
        .limit(limit)

      if (fallbackError) {
        console.error('Supabase search error:', fallbackError)
        return NextResponse.json({ results: [] })
      }

      return NextResponse.json({
        results: fallbackData?.map((r: { content: string }) => r.content) || []
      })
    }

    return NextResponse.json({
      results: data?.map((r: { content: string }) => r.content) || []
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
