"use client"

import { useEffect, useState } from "react"

type AlertVariant = "success" | "error"

interface AlertProps {
  variant: AlertVariant
  message: string
  title?: string
  autoClose?: boolean
  duration?: number // milliseconds
  onClose?: () => void
}

const variantStyles = {
  success: {
    container: "bg-green-50 border-green-200 text-green-800",
    icon: "text-green-600",
    iconPath:
      "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
  },
  error: {
    container: "bg-red-50 border-red-200 text-red-800",
    icon: "text-red-600",
    iconPath:
      "M10 18a8 8 0 100-16 8 8 0 000 16zM9 7h2v4H9V7zm0 6h2v2H9v-2z",
  },
}

export function Alert({
  variant,
  message,
  title,
  autoClose = false,
  duration = 4000,
  onClose,
}: AlertProps) {
  const [visible, setVisible] = useState(true)
  const styles = variantStyles[variant]

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setVisible(false)
        onClose?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onClose])

  if (!visible) return null

  return (
    <div
      className={`flex items-center gap-3 p-3 my-3 border rounded-lg shadow-sm ${styles.container}`}
    >
      <svg
        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${styles.icon}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path fillRule="evenodd" d={styles.iconPath} clipRule="evenodd" />
      </svg>
      <div className="flex flex-col">
        {title && <p className="font-medium">{title}</p>}
        <p
  className="text-sm"
  dangerouslySetInnerHTML={{ __html: message }}
></p>
      </div>
      {onClose && (
        <button
          onClick={() => {
            setVisible(false)
            onClose()
          }}
          className="ml-auto text-sm hover:underline"
        >
          ✕
        </button>
      )}
    </div>
  )
}
