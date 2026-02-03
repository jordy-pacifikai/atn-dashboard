import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = await fetch('https://n8n.srv1140766.hstgr.cloud/webhook/atn-generate-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generate' })
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Workflow error', status: response.status },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error generating content:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}
