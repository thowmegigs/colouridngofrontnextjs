import {
    AlertCircle,
    CheckCircle,
    Loader,
    Package, // For Return
    Repeat2,
    Send,
    Truck,
    Undo2, // For Exchange
    XCircle,
} from "lucide-react";

const StatusIcon = ({ status }) => {
  if (!status) return null;

  const lower = status.toLowerCase();
  let IconComponent = AlertCircle;
  let colorClass = "text-gray-500";

  if (lower.includes("order placed") || lower.includes("ordered")) {
    IconComponent = Package;
    colorClass = "text-blue-500";
  } else if (lower.includes("pickup scheduled")) {
    IconComponent = Send;
    colorClass = "text-indigo-500";
  } else if (lower.includes("in transit")) {
    IconComponent = Truck;
    colorClass = "text-yellow-500";
  } else if (lower.includes("out for delivery")) {
    IconComponent = Loader;
    colorClass = "text-orange-500 animate-spin";
  } else if (lower.includes("delivered")) {
    IconComponent = CheckCircle;
    colorClass = "text-green-600";
  } else if (lower.includes("return")) {
    IconComponent = Undo2;
    colorClass = "text-yellow-600";
  } else if (lower.includes("exchange")) {
    IconComponent = Repeat2;
    colorClass = "text-purple-600";
  } else if (lower.includes("cancelled") || lower.includes("canceled")) {
    IconComponent = XCircle;
    colorClass = "text-red-600";
  }

  return (
      <IconComponent className={`w-5 h-5 ${colorClass}`} />
     
  );
};

export default StatusIcon;
