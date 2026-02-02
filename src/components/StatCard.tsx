'use client'

import { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: ReactNode
  iconColor?: string
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
}

export default function StatCard({
  label,
  value,
  change,
  changeLabel,
  icon,
  iconColor = 'text-atn-secondary',
  variant = 'default',
}: StatCardProps) {
  const variantColors = {
    default: 'from-atn-secondary to-atn-primary',
    success: 'from-emerald-500 to-emerald-600',
    warning: 'from-amber-500 to-amber-600',
    error: 'from-red-500 to-red-600',
    info: 'from-blue-500 to-blue-600',
  }

  const getTrendIcon = () => {
    if (change === undefined || change === 0) return <Minus className="w-3 h-3" />
    return change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />
  }

  const getTrendColor = () => {
    if (change === undefined || change === 0) return 'text-foreground-tertiary'
    return change > 0 ? 'text-emerald-500' : 'text-red-500'
  }

  return (
    <div className="stat-card group relative overflow-hidden">
      {/* Gradient accent bar */}
      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${variantColors[variant]} rounded-l-xl`} />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="stat-label text-foreground-secondary">{label}</p>
          <p className="stat-value text-foreground-primary mt-1">{value}</p>

          {change !== undefined && (
            <div className={`stat-change ${getTrendColor()} mt-2`}>
              {getTrendIcon()}
              <span className="font-medium">
                {change > 0 ? '+' : ''}{change}%
              </span>
              {changeLabel && (
                <span className="text-foreground-tertiary ml-1">{changeLabel}</span>
              )}
            </div>
          )}
        </div>

        {icon && (
          <div className={`p-3 rounded-xl bg-background-tertiary ${iconColor} transition-transform group-hover:scale-110`}>
            {icon}
          </div>
        )}
      </div>

      {/* Subtle hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className={`absolute -inset-px bg-gradient-to-r ${variantColors[variant]} opacity-5 rounded-xl`} />
      </div>
    </div>
  )
}
