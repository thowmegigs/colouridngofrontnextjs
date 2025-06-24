import {
  AlertCircle,
  CheckCircle
} from "lucide-react";

const StatusIcon = ({ status }) => {
  if (!status) return null;

  const lower = status.toLowerCase();
  let IconComponent = AlertCircle;
  let colorClass = "text-gray-500";

    IconComponent = CheckCircle;
    colorClass = "text-green-600";
  

  return (
      <IconComponent className={`w-5 h-5 ${colorClass}`} />
     
  );
};

export default StatusIcon;
