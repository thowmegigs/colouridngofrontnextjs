import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { apiRequest } from "@/lib/api"; // Adjust to your request util
import { colorNameToHex } from "@/lib/utils";
import { ChevronDown, ChevronUp, RefreshCcw, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { Sheet } from 'react-modal-sheet';
import { capitalize, formatCurrency, formatDate } from "../lib/utils";
import LoadingScreen from "../loading";
import SafeImage from "./SafeImage";
import StatusIcon from "./status-icons";

export default function OrderItemCard({ item, index, orderId, imageBaseUrl,orderUid }) {
    const [expanded, setExpanded] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const [timelineData, setTimelineData] = useState(null);
    const checkIfReturnDateExpired = useMemo(() => {
        // if(order){
        //   const orderDate = new Date(order.created_at);
        //   const return_window=parseInt(process.env.NEXT_PUBLIC_RETURN_DAYS);
        //   const returnDeadline = new Date(orderDate.getTime() + return_window * 24 * 60 * 60 * 1000);
        //   const now = new Date();
        //   return now > returnDeadline
        // }
        return false
    }, [])
    const imageurl = item.variant_id
        ? `${imageBaseUrl}/storage/products/${item.product_id}/variants/${item.variant_image}`
        : `${imageBaseUrl}/storage/products/${item.product_id}/${item.product_image}`;

    const originalAttributes = item.original_atributes ? JSON.parse(item.original_atributes) : null;

    const handleToggleStatus = async () => {
         setExpanded(prev => !prev);
            setStatusLoading(true);
            try {
                const response = await apiRequest(`orders/order-item-delivery-status`, {
                    method: "POST",
                    requestData: { itemId: item.order_item_id, orderId },
                });

                const timelines = response.data.timelines;

                console.log("Delivery status:", status);

                setTimelineData(timelines);
            } catch (error) {
                console.error("Failed to fetch delivery status", error);
            } finally {
                  setStatusLoading(false);
            }
        }
       
    
    const onClose = useCallback(() => {
        setExpanded(false)
    }, [])
    return (
        <div key={index} className="flex flex-col gap-2 pb-4 border-b last:border-0">
            <div className="flex flex-row gap-4">
                <div className="flex-shrink-0">
                    <div className="relative h-24 w-24 rounded-md overflow-hidden">
                        <SafeImage src={imageurl} alt={item.name} fill className="object-cover" />
                    </div>
                </div>

                <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                            <h4 className="text-sm line-clamp-2">{item.name}</h4>
                            <h4 className="text-xs text-primary">{item.vendor_name}</h4>

                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                {originalAttributes?.Size && (
                                    <span className="text-xs font-semibold bg-gray-200 p-1 text-black">
                                        Size: {originalAttributes.Size}
                                    </span>
                                )}
                                {originalAttributes?.Color && (
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs font-semibold bg-gray-200 p-1 text-black">
                                            Color: {originalAttributes.Color}
                                        </span>
                                        <div
                                            className="w-3 h-3 rounded-full border"
                                            style={{ backgroundColor: colorNameToHex(originalAttributes.Color) || "#ccc" }}
                                        />
                                    </div>
                                )}
                            </div>

                            <p className="text-sm mt-1">
                                {formatCurrency(item.sale_price)} x {item.qty}
                            </p>
                        </div>

                        <div className="mt-2 sm:mt-0 text-right sm:text-center">
                            <p className="font-medium">
                                {formatCurrency(item.sale_price * item.qty)}
                            </p>
                            <p className="text-xs font-bold bg-green-50  text-green-900 p-1">
                                {item.delivery_status}
                            </p>

                            {item.delivery_status === "DELIVERED" && !item.return_id && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm" className="mt-2">
                                    <RefreshCcw className="h-4 w-4 mr-1" /> Return Options
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link
                                      href={`/customer/orders/${orderUid}/returns?itemId=${item.order_item_id}`}
                                    >
                                      Return Item
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/customer/orders/${orderUid}/exchange?itemId=${item.order_item_id}`}>
                                      Exchange Item
                                    </Link>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}

                            {/* {item.return_id && (
                                <Badge variant="outline" className="mt-2 bg-primary text-white border-none">
                                    {item.delivery_status}
                                </Badge>
                            )} */}
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleToggleStatus}
                        className="mt-2 text-xs underline text-gray-600 flex items-center px-0 mx-0"
                    >
                        {expanded ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                        {expanded ? "Hide Delivery Status" : "View Delivery Status"}
                    </Button>
                </div>
            </div>

            <Sheet isOpen={expanded} onClose={onClose}>
                <Sheet.Container>
                    <div className="flex items-center justify-between px-4 pt-4 pb-2">
                        <span className="text-lg font-semibold">Delivery Status</span>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <Sheet.Content>
                        <div className="overflow-y-auto max-h-[70vh] px-4 py-2">
                             {statusLoading ? (
                            <div className="flex justify-center items-center h-40">
                                <LoadingScreen />
                            </div>
                        ) :timelineData && Array.isArray(timelineData) && timelineData.map((update, index) => (
                                <div key={index} className="relative pl-8">
                                    {index !== timelineData.length - 1 && (
                                        <div className="absolute left-[11px] top-8 h-full w-0.5 bg-gray-200"></div>
                                    )}
                                    <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white ">
                                        <StatusIcon status={update.status} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{capitalize(update.status ?? update.name)}</h4>
                                        <time className="text-sm text-gray-500">{formatDate(update.date)}</time>
                                        {update.notes && <p className="mt-1 text-sm text-gray-600">{update.notes}</p>}
                                    </div>
                                </div>
                            ))}
                            
                        </div>
                      
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet>
        </div>
    );
}
