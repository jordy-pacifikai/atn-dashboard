// Airtable API client pour les logs business
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const BASE_ID = process.env.AIRTABLE_BASE_ID || 'appWd0x5YZPHKL0VK'

const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}`

// Tables IDs (créées dans cette session)
export const TABLES = {
  CONTACTS: 'tbllNHj2PW77fXJgN',
  NEWSLETTER_LOGS: 'tblqmEU5dRLaPxmvr',
  CONCIERGE_LOGS: 'tblgQGjRV96DvWRtk',
  SEO_CONTENT: 'tblH8zjZEkVwmS0zY',
  ROI_ALERTS: 'tblwAXKjUkyMLiGQw',
  DASHBOARD: 'tblBvewAKCF5gRvc4',
  BOOKING_LOGS: 'tblLSENg0uQCq2st3',
  SOCIAL_MENTIONS: 'tblA5ZvLSz2lJtVJ6',
  COMPETITOR_INTEL: 'tblglDZaOx7KpuY3v',
  FLIGHT_ALERTS: 'tblvH1t4jnzocfPAs',
  REVIEWS: 'tblQRjWqEiC722hhv',
  UPSELL_OFFERS: 'tbl1Rfbn8F1DkeRvo',
}

async function airtableFetch(tableId: string, options: RequestInit = {}) {
  const response = await fetch(`${BASE_URL}/${tableId}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`Airtable error: ${response.statusText}`)
  }

  return response.json()
}

// Types pour les records Airtable
export interface AirtableRecord<T> {
  id: string
  createdTime: string
  fields: T
}

export interface ConversationLog {
  Session: string
  Question: string
  Réponse: string
  'Temps (s)': number
  Tokens: number
  Date: string
}

export interface NewsletterLog {
  Contact: string
  Segment: string
  'Email Personnalisé': string
  'Score Personnalisation': number
  'Score Engagement': number
  Mots: number
  Date: string
}

export interface BookingLog {
  Session_ID: string
  Request_Type: string
  Route: string
  Class: string
  Passengers: number
  Request: string
  Response: string
  Status: string
  Date: string
}

export interface SocialMention {
  Mention_ID: string
  Platform: string
  Author: string
  Content: string
  Sentiment: string
  Sentiment_Score: number
  Reach: number
  Priority: string
  Response_Suggested: string
  Status: string
  Date: string
}

export interface Review {
  Review_ID: string
  Platform: string
  Author: string
  Rating: number
  Review_Text: string
  Sentiment: string
  Topics: string[]
  Response_Generated: string
  Response_Tone: string
  Status: string
  Date: string
}

// Fonctions de récupération
export async function getConversations(limit = 50): Promise<AirtableRecord<ConversationLog>[]> {
  const data = await airtableFetch(
    `${TABLES.CONCIERGE_LOGS}?maxRecords=${limit}&sort[0][field]=Date&sort[0][direction]=desc`
  )
  return data.records
}

export async function getNewsletters(limit = 50): Promise<AirtableRecord<NewsletterLog>[]> {
  const data = await airtableFetch(
    `${TABLES.NEWSLETTER_LOGS}?maxRecords=${limit}&sort[0][field]=Date&sort[0][direction]=desc`
  )
  return data.records
}

export async function getBookings(limit = 50): Promise<AirtableRecord<BookingLog>[]> {
  const data = await airtableFetch(
    `${TABLES.BOOKING_LOGS}?maxRecords=${limit}&sort[0][field]=Date&sort[0][direction]=desc`
  )
  return data.records
}

export async function getSocialMentions(limit = 50): Promise<AirtableRecord<SocialMention>[]> {
  const data = await airtableFetch(
    `${TABLES.SOCIAL_MENTIONS}?maxRecords=${limit}&sort[0][field]=Date&sort[0][direction]=desc`
  )
  return data.records
}

export async function getReviews(limit = 50): Promise<AirtableRecord<Review>[]> {
  const data = await airtableFetch(
    `${TABLES.REVIEWS}?maxRecords=${limit}&sort[0][field]=Date&sort[0][direction]=desc`
  )
  return data.records
}

// Fonction pour mettre à jour un record
export async function updateRecord(tableId: string, recordId: string, fields: any): Promise<void> {
  await airtableFetch(`${tableId}/${recordId}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields }),
  })
}
