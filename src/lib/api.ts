// API configuration for n8n webhooks - 25 Builds ATN
const N8N_BASE_URL = process.env.NEXT_PUBLIC_N8N_URL || 'https://n8n.srv1140766.hstgr.cloud/webhook'

export const WEBHOOKS = {
  // Builds 1-10 (Agents IA Métier)
  concierge: `${N8N_BASE_URL}/atn-concierge`,
  newsletter: `${N8N_BASE_URL}/atn-newsletter-demo`,
  seoContent: `${N8N_BASE_URL}/atn-seo-content`,
  roiAnalyst: `${N8N_BASE_URL}/atn-roi-analyst`,
  bookingAssistant: `${N8N_BASE_URL}/atn-booking-assistant`,
  socialMonitor: `${N8N_BASE_URL}/atn-social-monitor`,
  competitorIntel: `${N8N_BASE_URL}/atn-competitor-intel`,
  flightNotifier: `${N8N_BASE_URL}/atn-flight-notifier`,
  reviewResponder: `${N8N_BASE_URL}/atn-review-responder`,
  upsellEngine: `${N8N_BASE_URL}/atn-upsell-engine`,

  // Builds 11-15 (Dashboard Management)
  dashboardApi: `${N8N_BASE_URL}/atn-dashboard-api`,
  contentScheduler: `${N8N_BASE_URL}/atn-content-scheduler`,
  assistant: `${N8N_BASE_URL}/atn-assistant`,
  reportGenerator: `${N8N_BASE_URL}/atn-report-generator`,
  smartGenerator: `${N8N_BASE_URL}/atn-smart-generator`,

  // Builds 16-20 (IA Avancée)
  reviewIntelligence: `${N8N_BASE_URL}/atn-review-intelligence`,
  visualFactory: `${N8N_BASE_URL}/atn-visual-factory`,
  conciergePro: `${N8N_BASE_URL}/atn-concierge-pro`,
  staffAssistant: `${N8N_BASE_URL}/atn-staff-assistant`,
  pricingMonitor: `${N8N_BASE_URL}/atn-pricing-monitor`,

  // Builds 21-25 (Marketing Automation V2)
  journeyOrchestrator: `${N8N_BASE_URL}/atn-journey-trigger`,
  abTest: `${N8N_BASE_URL}/atn-ab-test`,
  leadScoring: `${N8N_BASE_URL}/atn-lead-scoring`,
  attribution: `${N8N_BASE_URL}/atn-attribution`,
  preferences: `${N8N_BASE_URL}/atn-preferences`,
}

// ============================================
// DASHBOARD API (Build 11)
// ============================================

export type DashboardAction =
  | 'get_calendar'
  | 'create_content'
  | 'update_content'
  | 'delete_content'
  | 'get_prompts'
  | 'update_prompt'
  | 'update_config'

interface DashboardApiParams {
  action: DashboardAction
  [key: string]: any
}

export async function callDashboardApi(params: DashboardApiParams) {
  try {
    const response = await fetch(WEBHOOKS.dashboardApi, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    return await response.json()
  } catch (error) {
    console.error('Dashboard API error:', error)
    return { success: false, error: String(error) }
  }
}

// Calendar API
export async function getCalendarContent(startDate?: string, endDate?: string) {
  return callDashboardApi({
    action: 'get_calendar',
    start_date: startDate,
    end_date: endDate,
  })
}

export async function createContent(data: {
  type: 'newsletter' | 'article'
  title: string
  scheduled_date: string
  status?: string
  category?: string
}) {
  return callDashboardApi({
    action: 'create_content',
    ...data,
  })
}

export async function updateContent(recordId: string, data: {
  title?: string
  scheduled_date?: string
  status?: string
  prompt_history?: string
}) {
  return callDashboardApi({
    action: 'update_content',
    record_id: recordId,
    ...data,
  })
}

export async function deleteContent(recordId: string) {
  return callDashboardApi({
    action: 'delete_content',
    record_id: recordId,
  })
}

// Prompts API
export async function getPrompts() {
  return callDashboardApi({ action: 'get_prompts' })
}

export async function updatePrompt(recordId: string, promptText: string, currentVersion?: number) {
  return callDashboardApi({
    action: 'update_prompt',
    record_id: recordId,
    prompt_text: promptText,
    current_version: currentVersion,
  })
}

// ============================================
// AI ASSISTANT (Build 13)
// ============================================

export async function sendAssistantMessage(message: string, sessionId?: string) {
  try {
    const response = await fetch(WEBHOOKS.assistant, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        session_id: sessionId || `dashboard_${Date.now()}`,
        source: 'dashboard'
      }),
    })
    const data = await response.json()
    return {
      success: true,
      response: data.response || data.message || 'Réponse reçue.',
    }
  } catch (error) {
    console.error('Assistant API error:', error)
    return { success: false, error: String(error) }
  }
}

// ============================================
// REPORT GENERATOR (Build 14)
// ============================================

export type ReportType =
  | 'daily-summary'
  | 'weekly-marketing'
  | 'roi-analysis'
  | 'customer-satisfaction'
  | 'upsell-performance'
  | 'competitor-intel'
  | 'flight-ops'
  | 'content-seo'
  | 'journey-performance'
  | 'ab-test-results'
  | 'lead-scoring-report'
  | 'attribution-report'
  | 'custom'

export async function generateReport(reportType: ReportType, customPrompt?: string) {
  try {
    const response = await fetch(WEBHOOKS.reportGenerator, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        report_type: reportType,
        custom_prompt: customPrompt,
        requested_by: 'dashboard',
      }),
    })
    return await response.json()
  } catch (error) {
    console.error('Report Generator error:', error)
    return { success: false, error: String(error) }
  }
}

// ============================================
// SMART CONTENT GENERATOR (Build 15)
// ============================================

export async function triggerSmartGeneration() {
  try {
    const response = await fetch(WEBHOOKS.smartGenerator, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'dashboard', trigger: 'manual' }),
    })
    return await response.json()
  } catch (error) {
    console.error('Smart Generator error:', error)
    return { success: false, error: String(error) }
  }
}

// ============================================
// REVIEW INTELLIGENCE (Build 16)
// ============================================

export interface ReviewAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed'
  irony_detected: boolean
  themes: string[]
  praise: string[]
  complaints: string[]
  urgency: 'low' | 'medium' | 'high'
}

export async function analyzeReview(review: { source: string; text: string; rating?: number }) {
  try {
    const response = await fetch(WEBHOOKS.reviewIntelligence, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    })
    return await response.json() as { success: boolean; analysis: ReviewAnalysis }
  } catch (error) {
    console.error('Review Intelligence error:', error)
    return { success: false, error: String(error) }
  }
}

export async function getReviewInsights(period?: string) {
  try {
    const response = await fetch(WEBHOOKS.reviewIntelligence, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_insights', period: period || '30d' }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

// ============================================
// VISUAL FACTORY (Build 17)
// ============================================

export interface VisualAssetRequest {
  type: 'banner' | 'social' | 'email' | 'ad'
  destination?: string
  campaign?: string
  text?: string
  style?: string
  dimensions?: { width: number; height: number }
}

export async function generateVisualAsset(request: VisualAssetRequest) {
  try {
    const response = await fetch(WEBHOOKS.visualFactory, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    return await response.json()
  } catch (error) {
    console.error('Visual Factory error:', error)
    return { success: false, error: String(error) }
  }
}

// ============================================
// CONCIERGE PRO (Build 18)
// ============================================

export async function sendConciergeProMessage(params: {
  message: string
  language?: string
  sessionId?: string
  bookingRef?: string
  userId?: string
}) {
  try {
    const response = await fetch(WEBHOOKS.conciergePro, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    return await response.json()
  } catch (error) {
    console.error('Concierge Pro error:', error)
    return { success: false, error: String(error) }
  }
}

// ============================================
// STAFF ASSISTANT TALIA (Build 19)
// ============================================

export async function askStaffAssistant(params: {
  question: string
  employeeId: string
  department?: string
  category?: string
}) {
  try {
    const response = await fetch(WEBHOOKS.staffAssistant, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    return await response.json()
  } catch (error) {
    console.error('Staff Assistant error:', error)
    return { success: false, error: String(error) }
  }
}

// ============================================
// PRICING MONITOR (Build 20)
// ============================================

export async function getPricingReport(route?: string) {
  try {
    const response = await fetch(WEBHOOKS.pricingMonitor, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_report', route }),
    })
    return await response.json()
  } catch (error) {
    console.error('Pricing Monitor error:', error)
    return { success: false, error: String(error) }
  }
}

// ============================================
// JOURNEY ORCHESTRATOR (Build 21)
// ============================================

export type JourneyEventType = 'booking_confirmed' | 'cart_abandoned' | 'inactive_30d' | 'birthday'

export async function triggerJourney(params: {
  eventType: JourneyEventType
  customerId: string
  email: string
  bookingRef?: string
  destination?: string
  departureDate?: string
  metadata?: Record<string, any>
}) {
  try {
    const response = await fetch(WEBHOOKS.journeyOrchestrator, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    return await response.json()
  } catch (error) {
    console.error('Journey Orchestrator error:', error)
    return { success: false, error: String(error) }
  }
}

export async function getCustomerJourneys(customerId: string) {
  try {
    const response = await fetch(WEBHOOKS.journeyOrchestrator, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_journeys', customerId }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

// ============================================
// A/B TEST ENGINE (Build 22)
// ============================================

export interface ABTestConfig {
  testName: string
  variantA: { subject?: string; content?: string; cta?: string }
  variantB: { subject?: string; content?: string; cta?: string }
  splitRatio?: number
  metric?: 'open_rate' | 'click_rate' | 'conversion_rate'
  audienceSize?: number
}

export async function createABTest(config: ABTestConfig) {
  try {
    const response = await fetch(WEBHOOKS.abTest, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', ...config }),
    })
    return await response.json()
  } catch (error) {
    console.error('A/B Test error:', error)
    return { success: false, error: String(error) }
  }
}

export async function getABTestResults(testId: string) {
  try {
    const response = await fetch(WEBHOOKS.abTest, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'analyze', testId }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function assignABVariant(testId: string, email: string) {
  try {
    const response = await fetch(WEBHOOKS.abTest, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'assign', testId, eventData: { email } }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

// ============================================
// LEAD SCORING (Build 23)
// ============================================

export type LeadEventType =
  | 'page_view_pricing'
  | 'page_view_destinations'
  | 'price_simulation'
  | 'cart_add'
  | 'booking_start'
  | 'email_open'
  | 'email_click'
  | 'brochure_download'
  | 'concierge_chat'
  | 'booking_complete'

export async function trackLeadEvent(params: {
  customerId: string
  email: string
  eventType: LeadEventType
  eventData?: Record<string, any>
}) {
  try {
    const response = await fetch(WEBHOOKS.leadScoring, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'track', ...params }),
    })
    return await response.json()
  } catch (error) {
    console.error('Lead Scoring error:', error)
    return { success: false, error: String(error) }
  }
}

export async function getLeadScore(customerId: string) {
  try {
    const response = await fetch(WEBHOOKS.leadScoring, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_score', customerId }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getLeadsBySegment(segment: 'hot' | 'warm' | 'engaged' | 'cold') {
  try {
    const response = await fetch(WEBHOOKS.leadScoring, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'segment', eventData: { segment } }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

// ============================================
// ATTRIBUTION TRACKER (Build 24)
// ============================================

export interface Touchpoint {
  channel: string
  campaignId?: string
  source?: string
  medium?: string
  content?: string
}

export async function trackTouchpoint(customerId: string, touchpoint: Touchpoint) {
  try {
    const response = await fetch(WEBHOOKS.attribution, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'track_touchpoint', customerId, touchpoint }),
    })
    return await response.json()
  } catch (error) {
    console.error('Attribution error:', error)
    return { success: false, error: String(error) }
  }
}

export async function recordConversion(customerId: string, conversionData: { revenue: number; bookingRef?: string }) {
  try {
    const response = await fetch(WEBHOOKS.attribution, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'conversion', customerId, conversionData }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getCampaignAttribution(campaignId: string) {
  try {
    const response = await fetch(WEBHOOKS.attribution, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'report', campaignId }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

// ============================================
// PREFERENCE CENTER (Build 25)
// ============================================

export interface CustomerPreferences {
  frequency: 'daily' | 'weekly' | 'monthly' | 'never'
  contentTypes: {
    promotions: boolean
    inspiration: boolean
    news: boolean
    tips: boolean
  }
  channels: {
    email: boolean
    sms: boolean
    push: boolean
  }
  interests: {
    borabora: boolean
    moorea: boolean
    diving: boolean
    honeymoon: boolean
    family: boolean
    business: boolean
  }
  language: string
}

export async function getCustomerPreferences(email: string) {
  try {
    const response = await fetch(WEBHOOKS.preferences, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get', email }),
    })
    return await response.json()
  } catch (error) {
    console.error('Preferences error:', error)
    return { success: false, error: String(error) }
  }
}

export async function updateCustomerPreferences(customerId: string, email: string, preferences: Partial<CustomerPreferences>) {
  try {
    const response = await fetch(WEBHOOKS.preferences, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', customerId, email, preferences }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function unsubscribeCustomer(customerId: string, email: string, reason?: string, feedback?: string) {
  try {
    const response = await fetch(WEBHOOKS.preferences, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'unsubscribe',
        customerId,
        email,
        consentData: { reason, feedback }
      }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

// ============================================
// LEGACY TRIGGERS (Builds 1-10)
// ============================================

export async function triggerNewsletter(params: { title?: string; segment?: string }) {
  try {
    const response = await fetch(WEBHOOKS.newsletter, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, source: 'dashboard' }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function triggerArticle(params: { topic?: string; keywords?: string[] }) {
  try {
    const response = await fetch(WEBHOOKS.seoContent, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, source: 'dashboard' }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

// ============================================
// CONTENT CONFIG
// ============================================

export interface ContentConfig {
  generation_frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  content_per_week: number
  newsletters_per_week: number
  articles_per_week: number
  advance_weeks: number
  auto_suggestions: boolean
  suggestion_threshold: number
}

export async function getContentConfig(): Promise<ContentConfig | null> {
  return {
    generation_frequency: 'weekly',
    content_per_week: 7,
    newsletters_per_week: 3,
    articles_per_week: 4,
    advance_weeks: 4,
    auto_suggestions: true,
    suggestion_threshold: 20,
  }
}

export async function updateContentConfig(config: Partial<ContentConfig>) {
  return callDashboardApi({
    action: 'update_config',
    config,
  })
}
