"use client"

import { useMobile } from "@/hooks/use-mobile"
import {
  ArrowLeft,
  Check,
  MapPin,
  Package,
  PackageCheck,
  RefreshCw,
  Truck,
} from "lucide-react"
import { useEffect, useState } from "react"

const STATUS_FLOW = {
  order: [
    "ORDER PLACED",
    "APPROVED",
    "PICKED UP",
    "IN TRANSIT",
    "OUT FOR DELIVERY",
    "DELIVERED",
  ],
  return: [
    "RETURN REQUESTED",
    "APPROVED",
    "OUT FOR PICKUP",
    "PICKED UP",
    "OUT FOR DELIVERY",
    "DELIVERED",
    "REFUND COMPLETED",
  ],
  exchange: [
    "EXCHANGE REQUESTED",
    "APPROVED",
    "OUT FOR PICKUP",
    "PICKED UP",
    "OUT FOR DELIVERY",
    "DELIVERED",
    "REVERSE PICKED",
    "EXCHANGE DELIVERED",
  ],
}

const STATUS_ICONS = {
  "ORDER PLACED": Package,
  APPROVED: Check,
  "PICKED UP": Package,
  "IN TRANSIT": Truck,
  "OUT FOR DELIVERY": Truck,
  DELIVERED: MapPin,
  "RETURN REQUESTED": RefreshCw,
  "OUT FOR PICKUP": Truck,
  SHIPPED: PackageCheck,
  "REFUND COMPLETED": Check,
  "EXCHANGE REQUESTED": RefreshCw,
  "REVERSE PICKED": ArrowLeft,
  "EXCHANGE DELIVERED": MapPin,
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

function getStatusIcon(status: string) {
  const IconComponent = STATUS_ICONS[status as keyof typeof STATUS_ICONS]
  return IconComponent || Package
}

// 🔹 Status icon
function StatusIcon({
  isCompleted,
  status,
}: {
  isCompleted: boolean
  status: string
}) {
  const IconComponent = getStatusIcon(status)

  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center ${
        isCompleted ? "bg-emerald-500 text-white" : "bg-gray-300 text-gray-500"
      }`}
    >
      <IconComponent size={16} />
    </div>
  )
}

export default function OrderTimeline({
  item_status = [
    { status: "ORDER PLACED", date: "2025-09-10 20:58:57" },
    { status: "APPROVED", date: "2025-09-10 19:37:01" },
  ],
  type = "order",
  orientation = "vertical",
}: {
  item_status?: { status: string; date?: string }[]
  type?: keyof typeof STATUS_FLOW
  orientation?: "horizontal" | "vertical"
}) {
  const [currentOrientation, setCurrentOrientation] = useState(orientation)
  const isMobile = useMobile()

  useEffect(() => {
    setCurrentOrientation(isMobile ? "vertical" : "horizontal")
  }, [isMobile])

  const statusMap = Object.fromEntries(
    item_status.map((s) => [s.status.toUpperCase(), s.date || null])
  )

  const isStatusCompleted = (status: string) => !!statusMap[status]
  const getStatusDate = (status: string) => statusMap[status] || null

  const steps = STATUS_FLOW[type].map((status) => ({ status }))

  const formatDate = (date: string) => {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
   
    hour12: true, // 👈 now shows AM/PM
  })
}

  // 🔹 Vertical Layout
  if (currentOrientation === "vertical") {
    return (
      <div className="md:p-2 bg-white rounded-xl max-w-sm ps-2">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-md font-semibold text-gray-900 capitalize">
            {type} Status
          </h3>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

          {steps.map((step, index) => {
            const isCompleted = isStatusCompleted(step.status)
            const date = getStatusDate(step.status)

            return (
              <div
                key={index}
                className="relative flex items-start mb-6 last:mb-0"
              >
                {/* Icon */}
                <div className="relative z-10 flex-shrink-0 mt-1">
                  <StatusIcon status={step.status} isCompleted={isCompleted} />
                </div>

                {/* Connector line (skip for last step) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-[1.05rem] top-8 w-0.5 h-full">
                    <div
                      className={`h-full ${
                        isCompleted ? "bg-emerald-500" : "bg-gray-200"
                      }`}
                    />
                  </div>
                )}

                {/* Step card */}
                <div className="ml-4 flex-1">
                  <div className="bg-gray-50 rounded-lg p-3 shadow-sm">
                    <div
                      className={`font-semibold text-sm ${
                        isCompleted ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {step.status === "APPROVED"
                        ? "Confirmed"
                        : capitalize(step.status.replace(/_/g, " "))}
                    </div>

                    {isCompleted && date ? (
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(date)}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 mt-1">Pending</div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // 🔹 Horizontal Layout
  // 🔹 Horizontal Layout (compact)
// 🔹 Horizontal Layout (fixed connectors)
// 🔹 Horizontal Layout (connect circles only)
return (
  <div className="p-2 px-0 rounded-xl bg-white">
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex items-center justify-start mx-auto min-w-max px-0 pb-2">
        {steps.map((step, index) => {
          const isCompleted = isStatusCompleted(step.status)
          const date = getStatusDate(step.status)

          return (
            <div key={index} className="flex items-center">
              {/* Circle (status icon only) */}
              <div className="flex flex-col items-center">
                <StatusIcon status={step.status} isCompleted={isCompleted} />

                {/* Labels under the circle */}
                <div className="mt-2 text-center w-[99px]">
                  <div
                    className={`text-[11px] font-medium leading-tight ${
                      isCompleted ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {step.status === "APPROVED"
                      ? "Confirmed"
                      : capitalize(step.status.replace(/_/g, " "))}
                  </div>

                  {isCompleted && date ? (
                    <div className="text-[9px] text-gray-500 leading-tight">
                      {formatDate(date)}
                    </div>
                  ) : (
                    <div className="text-[9px] text-gray-400">Pending</div>
                  )}
                </div>
              </div>

              {/* Connector (between circles only, skip last) */}
              {index < steps.length - 1 && (
                <div className="h-0.5 w-10 relative -ml-[2px] -mr-[2px] self-center">
                  <div
                  style={{top: '-17px',height: '3px',width: '104px',left: '-31px'}}
                    className={`absolute inset-0 ${
                      isCompleted ? "bg-emerald-500" : "bg-gray-200"
                    }`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  </div>
)



}
