import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotificationProps {
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  onClose?: () => void
}

export function Notification({ type, title, message, onClose }: NotificationProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertCircle
  }

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100',
    error: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100',
    info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100'
  }

  const Icon = icons[type]

  return (
    <div className={cn('p-4 rounded-lg border flex items-start gap-3', colors[type])}>
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-sm mt-1 opacity-90">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-current opacity-50 hover:opacity-100 transition-opacity"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
