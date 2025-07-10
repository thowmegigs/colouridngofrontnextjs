'use client'

import { Check } from 'lucide-react'

const colors = {
  success: '#28a745',
  warning: '#ffc107',
  info: '#17a2b8',
  surface: '#ffffff',
  text: '#000000',
  textSecondary: '#6c757d',
  ui: '#e0e0e0',
}

const STATUS_FLOW = {
  order: ['ORDER REQUESTED', 'APPROVED', 'PICKED', 'OUT FOR DELIVERY', 'DELIVERED'],
  return: [
    'RETURN REQUESTED',
    'APPROVED',
    'OUT FOR PICKUP',
    'PICKED UP',
    'OUT FOR DELIVERY',
    'DELIVERED',
    'REFUND COMPLETED',
  ],
  exchange: [
    'EXCHANGE REQUESTED',
    'APPROVED',
    'OUT FOR PICKUP',
    'PICKED UP',
    'OUT FOR DELIVERY',
    'DELIVERED',
    'REVERSE PICKED',
    'EXCHANGE DELIVERED',
  ],
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export default function OrderTimeline({
  item_status,
  type = 'exchange',
}: {
  item_status: string[]
  type?: keyof typeof STATUS_FLOW
}) {
  const steps = STATUS_FLOW[type].map((status) => ({
    status,
    completed:
      item_status.includes(status) ||
      item_status.includes(capitalize(status.toLowerCase())) ||
      item_status.includes(status.toLowerCase()),
  }))

  return (
    <div className="pt-10 overflow-x-auto bg-white">
      <div className="flex items-start space-x-6 py-6 px-4 min-w-max">
        {steps.map((step, index) => {
          const next = steps[index + 1]
          const isCompleted = step.completed
          const nextCompleted = next?.completed

          return (
            <div key={index} className="relative w-[110px] text-center">
              {/* Icon */}
              <div
                className={`w-8 h-8 rounded-full mb-2 mx-auto flex items-center justify-center ${
                  isCompleted
                    ? 'bg-green-600 text-white'
                    : 'bg-white border-2 border-gray-300'
                }`}
              >
                {isCompleted ? <Check size={16} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-gray-400" />}
              </div>

              {/* Label */}
              <div className={`text-sm font-semibold ${isCompleted ? 'text-black' : 'text-gray-500'}`}>
                {step.status}
              </div>

              {/* Connector */}
              {next && (
                <div
                  className={`absolute top-4 left-full h-[3px] w-[100px] z-[-1] ${
                    isCompleted && nextCompleted
                      ? 'bg-green-600'
                      : isCompleted && !nextCompleted
                      ? 'border border-dashed border-green-600'
                      : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
