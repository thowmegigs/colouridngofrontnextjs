import clsx from "clsx";
import {
  AlertTriangle,
  CheckCircle,
  Clock3,
  PackageCheck,
  Truck,
  XCircle,
} from "lucide-react";
import React from "react";

const statusMap: Record<number, { label: string; icon: React.ReactNode }> = {
  6: { label: "Shipped", icon: <Truck size={18} /> },
  7: { label: "Delivered", icon: <CheckCircle size={18} /> },
  8: { label: "Canceled", icon: <XCircle size={18} /> },
  9: { label: "RTO Initiated", icon: <AlertTriangle size={18} /> },
  10: { label: "RTO Delivered", icon: <CheckCircle size={18} /> },
  12: { label: "Lost", icon: <XCircle size={18} /> },
  13: { label: "Pickup Error", icon: <XCircle size={18} /> },
  14: { label: "RTO Acknowledged", icon: <Truck size={18} /> },
  15: { label: "Pickup Rescheduled", icon: <Clock3 size={18} /> },
  16: { label: "Cancellation Requested", icon: <AlertTriangle size={18} /> },
  17: { label: "Out For Delivery", icon: <PackageCheck size={18} /> },
  18: { label: "In Transit", icon: <Truck size={18} /> },
  19: { label: "Out For Pickup", icon: <Truck size={18} /> },
  20: { label: "Pickup Exception", icon: <AlertTriangle size={18} /> },
  21: { label: "Undelivered", icon: <XCircle size={18} /> },
  22: { label: "Delayed", icon: <Clock3 size={18} /> },
  23: { label: "Partial Delivered", icon: <PackageCheck size={18} /> },
  24: { label: "Destroyed", icon: <XCircle size={18} /> },
};

interface ShipmentTimelineProps {
  statuses: { code: number; date: string }[];
  currentStatusCode: number;
}

const ShipmentTimeline: React.FC<ShipmentTimelineProps> = ({
  statuses,
  currentStatusCode,
}) => {
  const currentIndex = statuses.findIndex((s) => s.code === currentStatusCode);

  return (
    <div className="relative flex flex-col sm:flex-row sm:justify-between">
      {statuses.map((status, idx) => {
        const isLast = idx === statuses.length - 1;
        const isActive = idx === currentIndex;
        const isCompleted = idx < currentIndex;
        const { label, icon } = statusMap[status.code] || {
          label: "Unknown",
          icon: <Clock3 size={18} />,
        };

        return (
          <div
            key={idx}
            className={clsx(
              "relative flex gap-3 sm:flex-col sm:items-center",
              "pb-6 sm:pb-0 sm:flex-1"
            )}
          >
            {/* Connector */}
            {!isLast && (
              <div
                className={clsx(
                  "absolute",
                  "sm:top-5 sm:left-1/2 sm:translate-x-0 sm:h-0.5 sm:w-full",
                  "left-4 top-8 h-full w-0.5",
                  isCompleted || isActive
                    ? "bg-blue-600"
                    : "border border-dashed border-gray-400"
                )}
              />
            )}

            {/* Icon */}
            <div
              className={clsx(
                "rounded-full p-2 border-2 shrink-0 z-10",
                isActive
                  ? "border-blue-600 bg-blue-100 text-blue-700"
                  : isCompleted
                  ? "border-green-600 bg-green-100 text-green-700"
                  : "border-gray-300 bg-gray-100 text-gray-400"
              )}
            >
              {icon}
            </div>

            {/* Status + Date */}
            <div className="sm:text-center text-left">
              <div className="text-sm font-medium text-gray-800">{label}</div>
              <div className="text-xs text-gray-500">
                {new Date(status.date).toLocaleString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShipmentTimeline;
