import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour les tables Supabase
export interface WorkflowExecution {
  id: number
  workflow_id: string
  workflow_name: string
  build_number: number
  status: 'success' | 'error' | 'running'
  execution_time_ms: number
  tokens_used: number
  input_data: any
  output_data: any
  error_message: string | null
  created_at: string
}

export interface DailyMetric {
  id: number
  date: string
  build_number: number
  workflow_name: string
  total_executions: number
  successful_executions: number
  failed_executions: number
  avg_execution_time_ms: number
  total_tokens_used: number
  unique_sessions: number
}

export interface RealtimeAlert {
  id: number
  alert_type: 'error' | 'warning' | 'info' | 'success'
  build_number: number
  workflow_name: string
  title: string
  message: string
  data: any
  is_read: boolean
  created_at: string
}

// Fonctions helpers
export async function getRecentExecutions(limit = 50): Promise<WorkflowExecution[]> {
  const { data, error } = await supabase
    .from('atn_workflow_executions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function getDailyMetrics(days = 7): Promise<DailyMetric[]> {
  const { data, error } = await supabase
    .from('atn_daily_metrics')
    .select('*')
    .order('date', { ascending: false })
    .limit(days * 10) // 10 builds * days

  if (error) throw error
  return data || []
}

export async function getUnreadAlerts(): Promise<RealtimeAlert[]> {
  const { data, error } = await supabase
    .from('atn_realtime_alerts')
    .select('*')
    .eq('is_read', false)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function markAlertAsRead(alertId: number): Promise<void> {
  const { error } = await supabase
    .from('atn_realtime_alerts')
    .update({ is_read: true })
    .eq('id', alertId)

  if (error) throw error
}

export async function logExecution(execution: Omit<WorkflowExecution, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase
    .from('atn_workflow_executions')
    .insert(execution)

  if (error) throw error
}
