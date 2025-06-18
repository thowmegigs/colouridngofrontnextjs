import { api_url } from "@/contant";
import axios from "axios";
import { useEffect, useState } from "react";
import ShipmentTimeline from "./ShipmentTimeline";


const ShipmentStatusWrapper = ({ shipmentId }) => {
  const [statuses, setStatuses] = useState([]);
  const [currentCode, setCurrentCode] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(`${api_url}/shiprocket/shipment_status/${shipmentId}`);
   const data=response.data
        const trackingHistory = data?.tracking_data?.shipment_track || [];

        const formattedStatuses = trackingHistory.map((item: any) => ({
          code: parseInt(item?.status_code),
          date: item?.date || item?.updated_at,
        }));

        const latest = formattedStatuses.at(-1);

        setStatuses(formattedStatuses);
        setCurrentCode(latest?.code);
      } catch (error) {
        console.error("Failed to load shipment status", error);
      }
    };

    fetchStatus();
  }, [shipmentId]);

  return (
    <ShipmentTimeline
      statuses={statuses}
      currentStatusCode={currentCode}
    />
  );
};

export default ShipmentStatusWrapper;
