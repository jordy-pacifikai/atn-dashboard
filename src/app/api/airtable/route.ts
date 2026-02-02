import { NextRequest, NextResponse } from 'next/server'

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const BASE_ID = process.env.AIRTABLE_BASE_ID || 'appWd0x5YZPHKL0VK'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const table = searchParams.get('table')
  const limit = searchParams.get('limit') || '50'

  if (!table) {
    return NextResponse.json({ error: 'Table parameter required' }, { status: 400 })
  }

  if (!AIRTABLE_API_KEY) {
    return NextResponse.json({ error: 'Airtable API key not configured' }, { status: 500 })
  }

  try {
    const sortField = searchParams.get('sortField')
    const sortDir = searchParams.get('sortDir') || 'desc'

    let url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(table)}?maxRecords=${limit}`
    if (sortField) {
      url += `&sort[0][field]=${encodeURIComponent(sortField)}&sort[0][direction]=${sortDir}`
    }

    const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Airtable error: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Airtable API error:', error)
    return NextResponse.json({ error: 'Failed to fetch from Airtable' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const table = searchParams.get('table')
  const body = await request.json()

  if (!table) {
    return NextResponse.json({ error: 'Table parameter required' }, { status: 400 })
  }

  if (!AIRTABLE_API_KEY) {
    return NextResponse.json({ error: 'Airtable API key not configured' }, { status: 500 })
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${table}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields: body }),
      }
    )

    if (!response.ok) {
      throw new Error(`Airtable error: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Airtable API error:', error)
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const table = searchParams.get('table')
  const recordId = searchParams.get('recordId')
  const body = await request.json()

  if (!table || !recordId) {
    return NextResponse.json({ error: 'Table and recordId parameters required' }, { status: 400 })
  }

  if (!AIRTABLE_API_KEY) {
    return NextResponse.json({ error: 'Airtable API key not configured' }, { status: 500 })
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${table}/${recordId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields: body }),
      }
    )

    if (!response.ok) {
      throw new Error(`Airtable error: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Airtable API error:', error)
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 })
  }
}
