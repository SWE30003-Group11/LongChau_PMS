import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

const notificationVariants = cva(
  'fixed z-50 flex items-start gap-4 p-4 rounded-lg shadow-lg border max-w-[400px] left-4',
  {
    variants: {
      variant: {
        default: 'bg-white border-gray-200 text-gray-900',
        success: 'bg-green-50 border-green-200 text-green-900',
        error: 'bg-red-50 border-red-200 text-red-900',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
        info: 'bg-blue-50 border-blue-200 text-blue-900',
      },
      position: {
        top: 'top-4',
        bottom: 'bottom-4',
      }
    },
    defaultVariants: {
      variant: 'default',
      position: 'top'
    }
  }
)

export interface NotificationProps extends VariantProps<typeof notificationVariants> {
  title?: string
  message: string
  icon?: React.ReactNode
  duration?: number
  onClose?: () => void
}

export function NotificationBar({
  title,
  message,
  icon,
  variant,
  position,
  duration = 5000,
  onClose
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className={notificationVariants({ variant, position })}
      >
        {icon && <div>{icon}</div>}
        <div className="flex-1 space-y-1">
          {title && <p className="text-sm font-medium">{title}</p>}
          <p className="text-sm opacity-90">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            onClose?.()
          }}
          className="text-current opacity-70 hover:opacity-100 transition-opacity"
        >
          <X size={16} />
          <span className="sr-only">Close</span>
        </button>
      </motion.div>
    </AnimatePresence>
  )
}