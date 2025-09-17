// "use client"

// import type React from "react"

// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle
// } from "@/components/ui/dialog"
// import {
//   Drawer,
//   DrawerContent,
//   DrawerDescription,
//   DrawerHeader,
//   DrawerTitle
// } from "@/components/ui/drawer"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   createOrder,
//   deleteAddress,
//   encryptId,
//   fetchCities,
//   fetchStates,
//   fetchUserAddresses,
//   saveAddress,
//   type Address,
//   type OrderRequest,
//   type PaymentMethod,
//   type PincodeAvailabilityResponse
// } from "@/lib/api"
// import { capitalizeWords } from "@/lib/utils"
// import {
//   Check,
//   ChevronRight,
//   CreditCard,
//   CreditCardIcon,
//   Edit2,
//   Home,
//   Loader2,
//   Plus,
//   Search,
//   Shield,
//   Ticket,
//   X
// } from "lucide-react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { useCallback, useEffect, useMemo, useState } from "react"
// import { useMobile } from "../../hooks/use-mobile"

// import { api_url, image_base_url } from "@/contant"
// import { fetchAvailableCoupons, type Coupon } from "@/lib/api"
// import axios from "axios"
// import RazorpayPayment from "../components/razorpay-payment"
// import SafeImage from "../components/SafeImage"
// import { showToast } from "../components/show-toast"
// import { formatCurrency } from "../lib/utils"
// import { useAuth } from "../providers/auth-provider"
// import { useCart } from "../providers/cart-provider"


// export default function CheckoutPage() {
//   const { items, subtotal, discount, total,  clearCart,shipping_cost, appliedCoupon, applyCoupon, removeCoupon } = useCart()
//   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("razorpay")
//   const [pincode, setPincode] = useState("")
//   const [pincodeAvailability, setPincodeAvailability] = useState<PincodeAvailabilityResponse | null>(null)
//   const [checkingPincode, setCheckingPincode] = useState(false)
//   const [activeStep, setActiveStep] = useState<"address" | "delivery" | "payment">("address")
//   const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
//   const [selectedBillingAddress, setSelectedBillingAddress] = useState<string | null>(null)
//   const [useSameAddress, setUseSameAddress] = useState(true)
//   const [deliveryOption, setDeliveryOption] = useState("standard")
//   const [addingNewAddress, setAddingNewAddress] = useState(false)
//   const [editingAddress, setEditingAddress] = useState<Address | null>(null)
//   const [isProcessingOrder, setIsProcessingOrder] = useState(false)
//   const [addresses, setAddresses] = useState<Address[]>([])
//   const [isLoadingAddresses, setIsLoadingAddresses] = useState(true)
 
//   const [deliveryNotes, setDeliveryNotes] = useState("")
//   const [states, setStates] = useState<any>([])
//   const [checkoutItems,setCheckoutItems]=useState([])
//   const [selectedState, setSelectedState] = useState("")
//   const [cities, setCities] = useState<any>([])
//   const {user}=useAuth()
  
//   const [newAddress, setNewAddress] = useState<Partial<Address>>({
//     name: "",
//     phone_number: "", 
//     address1: "",
//     address2: "",
//     city_id: "",
//     state_id: "",
//     pincode: "",
//     is_default: "No",
//     address_for: "Shipping",
//   })
//   const [orderResponse, setOrderResponse] = useState<{
//     orderId: string
//     razorpayOrderId?: string
//     amount: number
//     requiresPayment: boolean
//   } | null>(null)

//   // Coupon state
//   const [couponCode, setCouponCode] = useState("")
//   const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
//   const [couponError, setCouponError] = useState<string | null>(null)
//   const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([])
//   const [isLoadingCoupons, setIsLoadingCoupons] = useState(false)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [isOpenCoupon, setIsOpenCoupon] = useState(false)

//   const isMobile = useMobile()
//   const router = useRouter()

//   // Check if user is logged in
//   const [isLoggedIn, setIsLoggedIn] = useState(false)
//   const [userData, setUserData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//   })

//   useEffect(() => {
//     // Check if user is logged in
//     const userToken = localStorage.getItem("userToken")
//     const loggedInFlag = localStorage.getItem("isLoggedIn")
//     const isUserLoggedIn = !!userToken || loggedInFlag === "true"
//     setIsLoggedIn(isUserLoggedIn)

//     // if (!isUserLoggedIn) {
//     //   router.push("/checkout/auth")
//     //   return
//     // }

//     // Get user data
//     const userName = localStorage.getItem("userName") || ""
//     const userEmail = localStorage.getItem("userEmail") || ""
//     const userPhone = localStorage.getItem("userPhone") || ""

//     setUserData({
//       name: userName,
//       email: userEmail,
//       phone: userPhone,
//     })

//     // Check for coupon from cart page
//     const cartCoupon = localStorage.getItem("cartCoupon")
//     if (cartCoupon && !appliedCoupon) {
//       try {
//         const couponData = JSON.parse(cartCoupon)
//         applyCoupon(couponData.code)
//       } catch (error) {
//         console.error("Error parsing cart coupon:", error)
//       }
//     }

//     // Load addresses
//     loadAddresses()
//   }, [router, appliedCoupon, applyCoupon])

//   // Fetch available coupons when the dialog/drawer is opened
//   useEffect(() => {
//     if (isOpenCoupon) {
//       const loadCoupons = async () => {
//         setIsLoadingCoupons(true)
//         try {
//           const coupons = await fetchAvailableCoupons()
//           setAvailableCoupons(coupons)
//         } catch (error) {
//           console.error("Error fetching coupons:", error)
//           showToast({
//             title: "Error", description: "Failed to load available coupons",
//             variant: 'destructive'
//           })
//         } finally {
//           setIsLoadingCoupons(false)
//         }
//       }

//       loadCoupons()
//     }
//   }, [isOpenCoupon])

//   // Filter coupons based on search query
//   const filteredCoupons = useMemo(() => {
//     if (!searchQuery.trim()) return availableCoupons

//     const query = searchQuery.toLowerCase()
//     return availableCoupons.filter(
//       (coupon) =>
//         coupon.code.toLowerCase().includes(query) ||
//         coupon.description?.toLowerCase().includes(query) ||
//         (coupon.discount_type === "Percent" && `${coupon.discount}%`.includes(query)) ||
//         (coupon.discount_type === "Flat" && `$${coupon.discount}`.includes(query)),
//     )
//   }, [availableCoupons, searchQuery])

//   useEffect(() => {
//     const getCitis = async () => {
//       const resp = await fetchCities(selectedState as any)
   
//       setCities(resp.data.rows)
//     }
//     if (selectedState) {
//       getCitis()
//     }
//   }, [selectedState])
// useEffect(()=>{
//   if(items){
//     const mod=items.map((item)=>({...item,deliverable:true}))
//     setCheckoutItems(mod)
//   }
// },[items])

//  const handlePaymentMethodSelect= useCallback(
//     (method) => () => {
    
//       setPaymentMethod(method);
//     },
//     [] // no dependencies because `setPaymentMethod` is stable
//   );


//   const loadAddresses = async () => {
//     setIsLoadingAddresses(true)
//     try {
//       const userAddresses: any = await fetchUserAddresses()

//       setAddresses(userAddresses.data.addresses)
//       const states: any = await fetchStates()
// console.log('states',states)
//       setStates(states.data.rows)

//       // Set default addresses if available
//       const defaultShipping = userAddresses.data.addresses.find(
//         (addr: any) => addr.address_for === "Shipping" && addr.is_default == "Yes",
//       )
//       const defaultBilling = userAddresses.data.addresses.find(
//         (addr: any) => addr.address_for === "Billing" && addr.is_default == "Yes",
//       )

//       if (defaultShipping) {
//         setSelectedAddress(defaultShipping.id)
//         setPincode(defaultShipping.pincode)
//       } else if (userAddresses.data.addresses.length > 0) {
//         const firstShipping = userAddresses.data.addresses.find((addr: any) => addr.address_for === "Shipping")
//         if (firstShipping) {
//           setSelectedAddress(firstShipping.id)
//           setPincode(firstShipping.pincode)
//         }
//       }

//       if (defaultBilling) {
//         setSelectedBillingAddress(defaultBilling.id)
//       }
//     } catch (error) {

//       showToast({
//         title: "Error", description: "Failed to load your saved addresses."
//       })
//     } finally {
//       setIsLoadingAddresses(false)
//     }
//   }

//   if (items.length === 0) {
//     return (
//       <div className="container py-12">
//         <div className="max-w-md mx-auto text-center">
//           <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
//           <p className="text-muted-foreground mb-6">
//             You need to add items to your cart before proceeding to checkout.
//           </p>
//           <Link href="/">
//             <Button>Continue Shopping</Button>
//           </Link>
//         </div>
//       </div>
//     )
//   }



//   const handleContinueToDelivery = () => {
//     if (!selectedAddress) {
//       showToast({  description: "Please select or add a shipping address to continue." ,variant:"destructive"})
//       return
//     }

//     if (useSameAddress) {
//       setSelectedBillingAddress(selectedAddress)
//     } else if (!selectedBillingAddress) {
//       showToast({
//         title: "Billing Address Required", description: "Please select or add a billing address to continue."
//       ,variant:"destructive"})
//       return
//     }

//     setActiveStep("delivery")
//     // Scroll to top on mobile
//     if (isMobile) {
//       window.scrollTo({ top: 0, behavior: "smooth" })
//     }
//   }

//   const handleContinueToPayment = () => {
//     setActiveStep("payment")
//     // Scroll to top on mobile
//     if (isMobile) {
//       window.scrollTo({ top: 0, behavior: "smooth" })
//     }
//   }

//   const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof Address) => {
//     setNewAddress({
//       ...newAddress,
//       [field]: e.target.value,
//     })
//   }

//   const handleSaveAddress = async () => {
//     console.log('new ad',newAddress)
//     if (
//       !newAddress.name ||
//       !newAddress.phone_number ||
//       !newAddress.address1 ||
//       !newAddress.city_id ||
//       !newAddress.state_id ||
//       !newAddress.pincode
//     ) {
//       showToast({
//         title: "Incomplete Address", description: "Please fill in all required fields."
//       ,variant:"destructive"})
//       return
//     }

//     try {
//       const addressToSave = {
//         ...(newAddress as Address),
       
//         id: editingAddress?.id,
//       }

//       addressToSave.address_for = capitalizeWords(addressToSave.address_for) as any

//       const savedAddress = await saveAddress(addressToSave, addressToSave.id?true:false)

//       // Update addresses list
//       await loadAddresses()

//       // Select the newly saved address
//       if (savedAddress.address_for === "Shipping") {
//         setSelectedAddress(savedAddress.id)
//         setPincode(savedAddress.pincode)
//       } else {
//         setSelectedBillingAddress(savedAddress.id)
//       }

//       setAddingNewAddress(false)
//       setEditingAddress(null)
//       setNewAddress({
//         name: "",

//         phone_number: "",
//         address1: "",
//         address2: "",
//         city_id: "",
//         state_id: "",
//         pincode: "",
//         country: "India",
//         is_default: "No",
//         address_for: "Shipping",
//       })

//       // showToast({
//       //   title: "Address Saved", description: "Your address has been saved successfully."
//       // })
//     } catch (error) {
//       console.error("Error saving address:", error)
//       showToast({
//         title: "Error", description: "Failed to save your address. Please try again."
//       ,variant:"destructive"})
//     }
//   }

//   const handleDeleteAddress = async (id: string) => {
//     try {
//       await deleteAddress(id)

//       // Update addresses list
//       await loadAddresses()

//       // showToast({
//       //   title: "Address Deleted", description: "Your address has been deleted successfully."
//       // })
//     } catch (error) {
//       console.error("Error deleting address:", error)
//       showToast({
//         title: "Error", description: "Failed to delete your address. Please try again."
//       ,variant:"destructive"})
//     }
//   }

//   const handleEditAddress = async (address: Address) => {
  
//     const res = await fetchCities(address.state_id as any)
   
//     setCities(res.data.rows)
//     setEditingAddress(address)
//     setNewAddress({
//       ...address,phone_number:user?.phone
//     })
//     setAddingNewAddress(true)
//   }

//   const handleAddNewAddress = (type: "Shipping" | "Billing") => {
//     setEditingAddress(null)
//     setNewAddress({
//       name: "",

//       phone_number: userData.phone,
//       address1: "",
//       address2: "",
//       city_id: "",
//       state_id: "",
//       pincode: "",
    
//       is_default: "No",
//       address_for: type,
//       address_type:"Home"
//     })
//     setAddingNewAddress(true)
//   }

  
  
//   // Handle coupon application
//   const handleApplyCoupon = async () => {
//     if (!couponCode.trim()) {
//       setCouponError("Please enter a coupon code")
//       return
//     }

//     setIsApplyingCoupon(true)
//     setCouponError(null)

//     try {
//       const result = await applyCoupon(couponCode)

//         setCouponCode("")
//         showToast({
//           title: "Success", description: "Coupon applied successfully!"
//         })
     
//     } catch (error) {
     
//       setCouponError(error['message'])
//     } finally {
//       setIsApplyingCoupon(false)
//     }
//   }

//   // Handle coupon removal
//   const handleRemoveCoupon = () => {
//     removeCoupon()
//     showToast({
//       title: "Coupon Removed", description: "Coupon has been removed from your order."
//     })
//   }

//   const CouponsContent = () => (
//     <div className="space-y-4">
//       {isLoadingCoupons ? (
//         <div className="flex justify-center items-center py-8">
//           <Loader2 className="h-8 w-8 animate-spin text-primary" />
//           <span className="ml-2">Loading available coupons...</span>
//         </div>
//       ) : (
//         <>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search coupons..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-9"
//             />
//             {searchQuery && (
//               <button
//                 onClick={() => setSearchQuery("")}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
//               >
//                 <X className="h-4 w-4" />
//                 <span className="sr-only">Clear search</span>
//               </button>
//             )}
//           </div>

//           <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
//             {filteredCoupons && filteredCoupons.length > 0 ? (
//               filteredCoupons.map((coupon) => (
//                 <div key={coupon.code} className="border rounded-lg p-4 hover:border-primary transition-colors">
//                   <div className="flex flex-col space-y-3">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <div className="font-medium text-primary">{coupon.code}</div>
//                         <div className="text-sm text-muted-foreground">{coupon.description}</div>
//                       </div>
//                       <div className="text-lg font-bold text-primary">
//                         {coupon.discount_type === "Percent"
//                           ? `${coupon.discount}%`
//                           : `$${coupon.discount.toFixed(2)}`}
//                       </div>
//                     </div>

//                     <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
//                       <span>Min. order: ${coupon.cart_amount.toFixed(2)}</span>
//                       <span>Expires: {new Date(coupon.end_date).toLocaleDateString()}</span>
//                       {coupon.max_discount && (
//                         <span>Max discount: ${coupon.max_discount.toFixed(2)}</span>
//                       )}
//                     </div>

//                     <div className="flex justify-end gap-2">
//                       <Button
//                         variant="outline"
//                         onClick={() => {
//                           navigator.clipboard.writeText(coupon.code)
//                           showToast({
//                             title: "Copied!",
//                             description: `Coupon code ${coupon.code} copied to clipboard`,
//                           })
//                         }}
//                         className="w-full sm:w-auto"
//                       >
//                         Copy
//                       </Button>
//                       <Button onClick={() => handleApplyCoupon(coupon.code)} className="w-full sm:w-auto">
//                         Apply
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-6">
//                 <Search className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
//                 <p className="font-medium">No matching coupons found</p>
//                 <p className="text-sm text-muted-foreground mt-1">
//                   Try a different search term or browse all available coupons.
//                 </p>
//                 {searchQuery && (
//                   <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
//                     Clear Search
//                   </Button>
//                 )}
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   )

//   const handlePlaceOrder = async () => {
//     if (!selectedAddress || (!useSameAddress && !selectedBillingAddress)) {
//       showToast({
//         title: "Address Required", description: "Please select both shipping and billing addresses.",
//         variant:"destructive"
//       })
//       return
//     }
  

//     setIsProcessingOrder(true)

//     try {
//     console.log('dfdfd')
//       const orderItems = items.map((item) => ({
//         product_id: item.id,
//         variant_id: item.variantId as any,
//         name: item.name,
//         price: item.price,
//         sale_price: item.sale_price ?? 0.0,
//         quantity: item.quantity,
//         image: item.image,
//         vendor_id:item.vendorId,
//         size:item.size,color:item.color
//       }))

    
//       const orderData: OrderRequest = {
//         items: orderItems,
//         shipping_address_id: selectedAddress,
//         billing_address_id: useSameAddress ? selectedAddress : selectedBillingAddress || selectedAddress,
//         payment_method: paymentMethod,
//         shipping_method: deliveryOption as any,
//         delivery_instructions: deliveryNotes,
//         subtotal,
//         shipping_cost,
//         discount,
//         total: total + shipping_cost,
      
       
//       }

//       // Add coupon information if a coupon is applied
//       if (appliedCoupon) {
//         orderData.coupon_code = appliedCoupon.code
//         orderData.coupon_discount = appliedCoupon.discountAmount
//         orderData.coupon_type = appliedCoupon.details?.discount_type
//       }


//       const response = await createOrder(orderData)
     
//       if (response.success) {
//         if (paymentMethod === "razorpay" && response.payment_required && response.razorpay_order) {
//           // Set order response for Razorpay payment
//           setOrderResponse({
//             orderId: response.order_id,
//             razorpayOrderId: response.razorpay_order.id,
//             amount: response.razorpay_order.amount / 100, // Convert from paise to rupees
//             requiresPayment: true,
//           })
//         } else {
     
//           showToast({
//             title: "Order Placed Successfully!", description: response.message
//           })

//           // Clear cart and coupon data
//           clearCart()
//           localStorage.removeItem("cartCoupon")
//           const encryptedId = encryptId(response.order_id);

//           router.replace(`/order/success?id=${encodeURIComponent(encryptedId)}`)
//         }
//       } else {
//         showToast({
//           title: "Order Failed",
//           description: response.message || "Failed to place your order.Please try again.", variant: 'destructive'
//         })
//       }
//     } catch (error) {
     
//       showToast({
//         title: "Order Failed", description: "An error occurred while placing your order. Please try again.", variant: 'destructive'
//       })
//     } finally {
//       setIsProcessingOrder(false)
//     }
//   }

//   const handlePaymentSuccess = async ({ amount, orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature }: any) => {

//     try {
//       // const { amount, orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
//       // Send details to backend for verification
//       const res = await axios.post(`${api_url}/orders/payment/verify`, {
//         amount, orderId,
//         razorpay_payment_id,
//         razorpay_order_id,
//         razorpay_signature,
//       },{
//     withCredentials:true
//   });

//       if (res.data.success) {
//         // Show success message or redirect to order summary
//         showToast({
//           title: "Payment Successful!",
//           description: "Your order has been placed successfully."
//         })
//         // Optionally navigate to thank you or order confirmation page
//       } else {
//         showToast({
//           title: "Error!", description: "Payment verification failed", variant: 'destructive'
//         })

//       }



//       // Clear cart and coupon data
//       clearCart()
//       localStorage.removeItem("cartCoupon")
//       const encryptedId = encryptId(orderId);
//       router.push(`/order/success?id=${encodeURIComponent(encryptedId)}`)

//     } catch (error) {
//       alert('Something went wrong while verifying the payment.');
//     }
//   }

//   const handlePaymentFailure = (error: string) => {
//     showToast({
//       title: "Payment Failed",
//       description: error || "There was an issue with your payment. Please try again.", variant: 'destructive'
//     })
//     setOrderResponse(null)
//   }

	// Render different layouts for mobile and desktop
	if (isMobile) {
		return (
			<div className="pb-32 bg-gradient-to-b from-white to-gray-50 min-h-screen">
				{/* Mobile Header */}
				{/* Content - Single page layout */}
				<div className="container pb-24 overflow-y-auto space-y-8">
					{/* Address Section */}
					<div className="space-y-6">
						<div className="space-y-6">
							<h2 className="text-xl font-bold tracking-tight mb-2">Shipping Address</h2>
							{/* Card UI for address selection */}
							...existing code...
						</div>
					</div>
					{/* Payment Method Section */}
					<div className="space-y-6">
						<h2 className="text-xl font-bold tracking-tight mb-2">Payment Method</h2>
						{/* Card UI for payment method */}
						...existing code...
						{/* Coupon Section */}
						<div className="border rounded-xl shadow-sm p-6 mt-6 bg-white">
							<h3 className="font-semibold mb-4 flex items-center text-lg">
								<Ticket className="h-5 w-5 mr-2 text-primary" />
								{appliedCoupon ? "Applied Coupon" : "Apply Coupon"}
							</h3>
							...existing code...
						</div>
						<div className="border rounded-xl shadow-sm p-6 mt-6 bg-white">
							<h3 className="font-semibold mb-4 text-lg">Order Summary</h3>
							<div className="space-y-3">
								...existing code...
							</div>
						</div>
						<div className="flex items-center mt-6 p-4 rounded-xl bg-muted/30 shadow-sm">
							<Shield className="h-5 w-5 text-muted-foreground mr-3" />
							<p className="text-sm text-muted-foreground">
								Your payment information is processed securely. We do not store credit card details.
							</p>
						</div>
					</div>
				</div>
				{/* Fixed Bottom Bar */}
				<div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50 shadow-lg">
					{!orderResponse && (
						<div className="flex flex-col space-y-2">
							<div className="flex justify-between text-base mb-1">
								<span className="font-semibold">Total:</span>
								<span className="font-bold text-primary text-lg">
									{formatCurrency(total+shipping_cost)}
								</span>
							</div>
							<Button className="w-full text-lg py-3 rounded-xl" size="lg" onClick={handlePlaceOrder} disabled={isProcessingOrder}>
								{isProcessingOrder ? (
									<>
										<Loader2 className="mr-2 h-5 w-5 animate-spin" />
										Processing...
									</>
								) : (
									`Place Order${paymentMethod === "cod" ? " (Cash on Delivery)" : ""}`
								)}
							</Button>
						</div>
					)}
				</div>
				{/* Coupon Drawer for Mobile */}
				<Drawer open={isOpenCoupon} onOpenChange={setIsOpenCoupon}>
					<DrawerContent className="rounded-t-xl shadow-xl">
						<DrawerHeader className="pb-2">
							<DrawerTitle className="text-lg font-bold">Available Coupons</DrawerTitle>
							<DrawerDescription>Select a coupon to apply to your order</DrawerDescription>
						</DrawerHeader>
						<div className="px-4 pb-4">
							<CouponsContent />
						</div>
					</DrawerContent>
				</Drawer>
			</div>
		)
	}

//                   <Button
//                     variant="outline"
//                     className="w-full flex items-center justify-center py-6 border-dashed"
//                     onClick={() => handleAddNewAddress("Shipping")}
//                   >
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add New Address
//                   </Button>

//                   {/* Billing Address Section */}
//                   <div className="mt-6 pt-4 border-t">
//                     <div className="flex items-center space-x-2 mb-4">
//                       <Checkbox
//                         id="same-address"
//                         checked={useSameAddress}
//                         onCheckedChange={(checked) => setUseSameAddress(checked as boolean)}
//                       />
//                       <Label htmlFor="same-address">Use shipping address for billing</Label>
//                     </div>

//                     {!useSameAddress && (
//                       <>
//                         <h3 className="text-lg font-semibold mb-3">Billing Address</h3>
//                         <RadioGroup
//                           value={selectedBillingAddress || ""}
//                           onValueChange={setSelectedBillingAddress}
//                           className="space-y-3"
//                         >
//                           {addresses
//                             .filter((address) => address.address_for === "Billing")
//                             .map((address) => (
//                               <div
//                                 key={address.id}
//                                 className={`border rounded-lg p-4 ${selectedBillingAddress === address.id ? "border-primary bg-primary/7" : ""
//                                   }`}
//                                 onClick={() => setSelectedBillingAddress(address.id)}
//                               >
//                                 <div className="flex items-start">
//                                   <RadioGroupItem
//                                     value={address.id || ""}
//                                     id={`billing-${address.id}`}
//                                     className="mt-1"
//                                   />
//                                   <div className="ml-3 flex-1">
//                                     <div className="flex justify-between">
//                                       <div className="flex items-center">
//                                         <span className="font-medium">{address.name}</span>
//                                         {address.is_default == "Yes" && (
//                                           <Badge variant="outline" className="ml-2 text-xs">
//                                             Default
//                                           </Badge>
//                                         )}
//                                       </div>
//                                       <div className="flex space-x-1">
//                                         <Button
//                                           variant="ghost"
//                                           size="sm"
//                                           className="h-8 w-8 p-0"
//                                           onClick={(e) => {
//                                             e.stopPropagation()
//                                             handleEditAddress(address)
//                                           }}
//                                         >
//                                           <Edit2 className="h-4 w-4" />
//                                         </Button>
//                                         <Button
//                                           variant="ghost"
//                                           size="sm"
//                                           className="h-8 w-8 p-0 text-destructive"
//                                           onClick={(e) => {
//                                             e.stopPropagation()
//                                             handleDeleteAddress(address.id || "")
//                                           }}
//                                         >
//                                           <X className="h-4 w-4" />
//                                         </Button>
//                                       </div>
//                                     </div>
//                                     <p className="text-sm mt-1">{address.name}</p>
//                                     <p className="text-sm text-muted-foreground">{address.phone_number}</p>
//                                     <p className="text-sm mt-2">{address.address1}</p>
//                                     {address.address2 && <p className="text-sm mt-2">{address.address2}</p>}
//                                     <p className="text-sm">
//                                       {address.city_name}, {address.state_name} {address.pincode}
//                                     </p>
//                                   </div>
//                                 </div>
//                               </div>
//                             ))}
//                         </RadioGroup>

//                         <Button
//                           variant="outline"
//                           className="w-full flex items-center justify-center py-6 border-dashed mt-3"
//                           onClick={() => handleAddNewAddress("Billing")}
//                         >
	// Desktop layout
	return (
		<div className="container py-12 bg-gradient-to-b from-white to-gray-50 min-h-screen">
			<div className="flex items-center mb-10">
				<Link href="/" className="text-muted-foreground hover:text-primary font-medium transition-colors">
					Home
				</Link>
				<ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
				<Link href="/cart" className="text-muted-foreground hover:text-primary font-medium transition-colors">
					Cart
				</Link>
				<ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
				<span className="font-semibold text-primary">Checkout</span>
			</div>
			{orderResponse && orderResponse.requiresPayment ? (
				<div className="max-w-2xl mx-auto">
					<Card className="overflow-hidden shadow-xl rounded-2xl">
						<CardContent className="p-10">
							<div className="text-center">
								<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
									<CreditCardIcon className="h-10 w-10" />
								</div>
								<h2 className="text-3xl font-bold mb-2">Complete Your Payment</h2>
								<p className="text-muted-foreground mb-4">
									Your order has been created. Please complete the payment to finalize your purchase.
								</p>
								<div className="mt-6 p-6 bg-muted/30 rounded-xl">
									<p className="font-semibold text-xl">Order Total: {formatCurrency(orderResponse.amount / 100)}</p>
									<p className="text-muted-foreground">Order ID: {orderResponse.orderId}</p>
								</div>
							</div>
							<div className="mt-10">
								<RazorpayPayment
									orderId={orderResponse.orderId}
									razorpayOrderId={orderResponse.razorpayOrderId || ""}
									amount={orderResponse.amount}
									name={userData.name}
									onSuccess={handlePaymentSuccess}
									onFailure={handlePaymentFailure}
								/>
								<Button variant="outline" className="w-full mt-6" onClick={() => setOrderResponse(null)}>
									Cancel Payment
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
					<div className="lg:col-span-2 space-y-10">
						{/* Address Section */}
						<Card className="shadow-xl rounded-2xl">
							<CardContent className="p-8">
								<div className="flex justify-between items-center mb-6">
									<h2 className="text-2xl font-bold flex items-center">
										<Home className="h-6 w-6 mr-2 text-primary" />
										Shipping Address
									</h2>
									{!addingNewAddress && (
										<Button variant="outline" size="sm" className="rounded-lg" onClick={() => handleAddNewAddress("Shipping")}> 
											<Plus className="h-4 w-4 mr-2" />
											Add New
										</Button>
									)}
								</div>
								...existing code...
							</CardContent>
						</Card>
						{/* Payment Method */}
						<Card className="shadow-xl rounded-2xl">
							<CardContent className="p-8">
								<h2 className="text-2xl font-bold flex items-center mb-6">
									<CreditCard className="h-6 w-6 mr-2 text-primary" />
									Payment Method
								</h2>
								...existing code...
								{/* Coupon Section */}
								<div className="mt-8 border rounded-xl shadow-sm p-6 bg-white">
									<h3 className="font-semibold mb-4 flex items-center text-lg">
										<Ticket className="h-5 w-5 mr-2 text-primary" />
										{appliedCoupon ? "Applied Coupon" : "Apply Coupon"}
									</h3>
									...existing code...
								</div>
								<div className="flex items-center mt-8 p-4 rounded-xl bg-muted/30 shadow-sm">
									<Shield className="h-5 w-5 text-muted-foreground mr-3" />
									<p className="text-sm text-muted-foreground">
										Your payment information is processed securely. We do not store credit card details.
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
					<div className="lg:col-span-1">
						<div className="border rounded-2xl overflow-hidden sticky top-24 shadow-xl">
							<div className="bg-muted px-6 py-4 font-bold text-lg">Order Summary</div>
							<div className="p-8">
								<Accordion type="single" collapsible defaultValue="items">
									<AccordionItem value="items" className="border-none">
										<AccordionTrigger className="py-3 text-lg font-semibold">
											{items.length} {items.length === 1 ? "item" : "items"} in cart
										</AccordionTrigger>
										<AccordionContent>
											<ul className="space-y-6 mb-6">
												...existing code...
											</ul>
											{/* Show applied coupon in order summary */}
											{appliedCoupon && (
												<div className="mt-4 pt-4 border-t">
													<div className="flex items-center justify-between text-base">
														<div className="flex items-center text-green-600">
															<Ticket className="h-5 w-5 mr-2" />
															<span>Coupon: {appliedCoupon.code}</span>
														</div>
														<span className="text-green-600 font-bold">-{formatCurrency(discount)}</span>
													</div>
												</div>
											)}
										</AccordionContent>
									</AccordionItem>
								</Accordion>
								<div className="space-y-3 py-6 border-t border-b">
									...existing code...
								</div>
								<div className="mt-8">
									<Button className="w-full text-lg py-3 rounded-xl" size="lg" onClick={handlePlaceOrder} disabled={isProcessingOrder}>
										{isProcessingOrder ? (
											<>
												<Loader2 className="mr-2 h-5 w-5 animate-spin" />
												Processing Order...
											</>
										) : (
											`Place Order${paymentMethod === "cod" ? " (Cash on Delivery)" : ""}`
										)}
									</Button>
									<p className="text-xs text-muted-foreground text-center mt-6">
										By placing your order, you agree to our{" "}
										<Link href="/terms" className="text-primary hover:underline">
											Terms of Service
										</Link>{" "}
										and{" "}
										<Link href="/privacy" className="text-primary hover:underline">
											Privacy Policy
										</Link>
										.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
			{/* Coupon Dialog for Desktop */}
			<Dialog open={isOpenCoupon} onOpenChange={setIsOpenCoupon}>
				<DialogContent className="sm:max-w-md rounded-xl shadow-xl">
					<DialogHeader>
						<DialogTitle className="text-lg font-bold">Available Coupons</DialogTitle>
						<DialogDescription>Select a coupon to apply to your order</DialogDescription>
					</DialogHeader>
					<CouponsContent />
				</DialogContent>
			</Dialog>
		</div>
	)
//           </div>

//           {/* Payment Method Section */}
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold">Payment Method</h2>

//             {orderResponse && orderResponse.requiresPayment ? (
//               <div className="border rounded-lg p-6 space-y-4">
//                 <div className="text-center">
//                   <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
//                     <CreditCardIcon className="h-6 w-6" />
//                   </div>
//                   <h3 className="text-lg font-medium">Complete Your Payment</h3>
//                   <p className="text-muted-foreground mt-1">
//                     Your order has been created. Please complete the payment.
//                   </p>

//                   <div className="mt-4 p-4 bg-muted/30 rounded-lg">
//                     <p className="font-medium">Order Total: {formatCurrency(orderResponse.amount / 100)}</p>
//                     <p className="text-sm text-muted-foreground">Order ID: {orderResponse.orderId}</p>
//                   </div>
//                 </div>

//                 <div className="pt-4">
//                   <RazorpayPayment
//                     orderId={orderResponse.orderId}
//                     razorpayOrderId={orderResponse.razorpayOrderId || ""}
//                     amount={orderResponse.amount}
//                     name={user?.name || "Customer"}
//                      customerEmail={user?.email || ""}
//                     customerPhone={user?.phone}
//                     onSuccess={handlePaymentSuccess}
//                     onFailure={handlePaymentFailure}
//                   />

//                   <Button variant="outline" className="w-full mt-3" onClick={() => setOrderResponse(null)}>
//                     Cancel Payment
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <RadioGroup
//                 value={paymentMethod}
//                 onValueChange={(value) => handlePaymentMethodSelect(value as PaymentMethod)}
//                 className="space-y-3"
//               >
//                 <div
//                   className={`border rounded-lg p-4 ${paymentMethod === "razorpay" ? "border-primary bg-primary/7" : ""
//                     }`}
//                   onClick={()=>setPaymentMethod("razorpay")}
//                 >
//                   <div className="flex items-start">
//                     <RadioGroupItem value="razorpay" id="payment-razorpay" className="mt-1" />
//                     <div className="ml-3 flex-1">
//                       <div className="flex justify-between">
//                         <div className="flex items-center">
//                           <CreditCard className="h-5 w-5 mr-2" />
//                           <span className="font-medium">Credit / Debit Card</span>
//                         </div>
//                       </div>
//                       <p className="text-sm text-muted-foreground mt-1">Pay securely with Razorpay</p>
//                       <div className="flex items-center mt-2 space-x-2">
//                         <div className="h-6 w-10 bg-muted rounded flex items-center justify-center text-xs font-medium">
//                           VISA
//                         </div>
//                         <div className="h-6 w-10 bg-muted rounded flex items-center justify-center text-xs font-medium">
//                           MC
//                         </div>
//                         <div className=" bg-muted rounded flex items-center justify-center text-xs font-medium">
//                           NET BANKING
//                         </div>
//                         <div className="h-6 w-10 bg-muted rounded flex items-center justify-center text-xs font-medium">
//                           UPI
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div
//                   className={`border rounded-lg p-4 ${paymentMethod === "cod" ? "border-primary bg-primary/7" : ""}`}
//                   onClick={()=>setPaymentMethod("cod")}
//                 >
//                   <div className="flex items-start">
//                     <RadioGroupItem value="cod" id="payment-cod" className="mt-1" />
//                     <div className="ml-3 flex-1">
//                       <div className="flex justify-between">
//                         <div className="flex items-center">
                         
//                           <span className="font-medium">Cash on Delivery</span>
//                         </div>
//                       </div>
//                       <p className="text-sm text-muted-foreground mt-1">Pay when you receive your order</p>
//                     </div>
//                   </div>
//                 </div>
//               </RadioGroup>
//             )}

//             {/* Coupon Section */}
//             <div className="border rounded-lg p-4 mt-4">
//               <h3 className="font-medium mb-3 flex items-center">
//                 <Ticket className="h-4 w-4 mr-2" />
//                 {appliedCoupon ? "Applied Coupon" : "Apply Coupon"}
//               </h3>

//               {appliedCoupon ? (
//                 <div className="bg-green-50 border border-green-100 rounded-md p-3">
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center">
//                       <Check className="h-5 w-5 text-green-500 mr-2" />
//                       <div>
//                         <p className="font-medium text-green-700">Coupon Applied: {appliedCoupon.code}</p>
//                         <p className="text-sm text-green-600">
//                           You saved {formatCurrency(discount)}
//                           {appliedCoupon.details?.discount_type === "Percent" && ` (${appliedCoupon.details?.discount}% off)`}
//                         </p>
//                       </div>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="h-8 text-red-500 hover:text-red-700"
//                       onClick={handleRemoveCoupon}
//                     >
//                       Remove
//                     </Button>
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   <div className="flex gap-2">
//                     <div className="flex-1">
//                       <Input
//                         placeholder="Enter coupon code"
//                         value={couponCode}
//                         onChange={(e) => setCouponCode(e.target.value)}
//                         onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
//                       />
//                     </div>
//                     <Button onClick={handleApplyCoupon} disabled={isApplyingCoupon || !couponCode.trim()}>
//                       {isApplyingCoupon ? (
//                         <>
//                           <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                           Applying
//                         </>
//                       ) : (
//                         "Apply"
//                       )}
//                     </Button>
//                   </div>

//                   <Button 
//                     variant="outline" 
//                     className="w-full mt-3" 
//                     onClick={() => setIsOpenCoupon(true)}
//                   >
//                     <Ticket className="h-4 w-4 mr-2" />
//                     View Available Coupons
//                   </Button>
//                 </>
//               )}

//               {couponError && (
//                 <div className="mt-2 text-sm text-red-500 flex items-center">
//                   <X className="h-4 w-4 mr-1" />
//                   {couponError}
//                 </div>
//               )}
//             </div>

//             <div className="border rounded-lg p-4 mt-4">
//               <h3 className="font-medium mb-3">Order Summary</h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Subtotal</span>
//                   <span>{formatCurrency(subtotal)}</span>
//                 </div>

//                 {discount > 0 && (
//                   <div className="flex justify-between text-green-600">
//                     <span>Discount</span>
//                     <span>-{formatCurrency(discount)}</span>
//                   </div>
//                 )}

//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Shipping</span>
//                  <span>
//                    {formatCurrency(shipping_cost)}
//                   </span>
//                 </div>

//                 <div className="flex justify-between font-medium text-lg pt-2 border-t mt-2">
//                   <span>Total</span>
//                   <span>
//                     {formatCurrency(total+shipping_cost)}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center mt-4 p-4 rounded-lg bg-muted/30">
//               <Shield className="h-5 w-5 text-muted-foreground mr-3" />
//               <p className="text-sm text-muted-foreground">
//                 Your payment information is processed securely. We do not store credit card details.
//               </p>
//             </div>
//           </div>


//         </div>

//         {/* Fixed Bottom Bar */}
//         <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50 shadow-md">
//           {!orderResponse && (
//             <div className="flex flex-col space-y-2">
//               <div className="flex justify-between text-sm mb-1">
//                 <span>Total:</span>
//                 <span className="font-bold">
//                   {formatCurrency(total+shipping_cost)}
//                 </span>
//               </div>
//               <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isProcessingOrder}>
//                 {isProcessingOrder ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Processing...
//                   </>
//                 ) : (
//                   `Place Order${paymentMethod === "cod" ? " (Cash on Delivery)" : ""}`
//                 )}
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* Coupon Drawer for Mobile */}
//         <Drawer open={isOpenCoupon} onOpenChange={setIsOpenCoupon}>
//           <DrawerContent>
//             <DrawerHeader className="pb-2">
//               <DrawerTitle>Available Coupons</DrawerTitle>
//               <DrawerDescription>Select a coupon to apply to your order</DrawerDescription>
//             </DrawerHeader>
//             <div className="px-4 pb-4">
//               <CouponsContent />
//             </div>
//           </DrawerContent>
//         </Drawer>
//       </div>
//     )
//   }

//   // Desktop layout
//   return (
//     <div className="container py-8">
//       <div className="flex items-center mb-8">
//         <Link href="/" className="text-muted-foreground hover:text-foreground">
//           Home
//         </Link>
//         <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
//         <Link href="/cart" className="text-muted-foreground hover:text-foreground">
//           Cart
//         </Link>
//         <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
//         <span>Checkout</span>
//       </div>

//       {orderResponse && orderResponse.requiresPayment ? (
//         <div className="max-w-2xl mx-auto">
//           <Card className="overflow-hidden">
//             <CardContent className="p-8">
//               <div className="text-center">
//                 <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
//                   <CreditCardIcon className="h-8 w-8" />
//                 </div>
//                 <h2 className="text-2xl font-bold">Complete Your Payment</h2>
//                 <p className="text-muted-foreground mt-2">
//                   Your order has been created. Please complete the payment to finalize your purchase.
//                 </p>

//                 <div className="mt-6 p-6 bg-muted/30 rounded-lg">
//                   <p className="font-medium text-lg">Order Total: {formatCurrency(orderResponse.amount / 100)}</p>
//                   <p className="text-muted-foreground">Order ID: {orderResponse.orderId}</p>
//                 </div>
//               </div>

//               <div className="mt-8">
//                 <RazorpayPayment
//                   orderId={orderResponse.orderId}
//                   razorpayOrderId={orderResponse.razorpayOrderId || ""}
//                   amount={orderResponse.amount}
//                   name={userData.name}
//                   onSuccess={handlePaymentSuccess}
//                   onFailure={handlePaymentFailure}
//                 />

//                 <Button variant="outline" className="w-full mt-4" onClick={() => setOrderResponse(null)}>
//                   Cancel Payment
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-8">
//             {/* Address Section */}
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-semibold flex items-center">
//                     <Home className="h-5 w-5 mr-2" />
//                     Shipping Address
//                   </h2>
//                   {!addingNewAddress && (
//                     <Button variant="outline" size="sm" onClick={() => handleAddNewAddress("Shipping")}>
//                       <Plus className="h-4 w-4 mr-2" />
//                       Add New
//                     </Button>
//                   )}
//                 </div>

//                 {isLoadingAddresses ? (
//                   <div className="flex justify-center py-8">
//                     <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                   </div>
//                 ) : !addingNewAddress ? (
//                   <div className="space-y-4">
//                     <RadioGroup value={selectedAddress || ""} onValueChange={setSelectedAddress}>
//                       {addresses
//                         .filter((address) => address.address_for === "Shipping")
//                         .map((address) => (
//                           <div
//                             key={address.id}
//                             className={`border rounded-lg p-4 ${selectedAddress === address.id ? "border-primary bg-primary/7" : ""
//                               }`}
//                           >
//                             <div className="flex items-start">
//                               <RadioGroupItem value={address.id || ""} id={`address-${address.id}`} className="mt-1" />
//                               <div className="ml-3 flex-1">
//                                 <div className="flex justify-between">
//                                   <div className="flex items-center">
//                                     <span className="font-medium">{address.name}</span>
//                                     {address.is_default == "Yes" && (
//                                       <Badge variant="outline" className="ml-2 text-xs">
//                                         Default
//                                       </Badge>
//                                     )}
//                                   </div>
//                                   <div className="flex space-x-2">
//                                     <Button
//                                       variant="ghost"
//                                       size="sm"
//                                       className="h-8 w-8 p-0"
//                                       onClick={() => handleEditAddress(address)}
//                                     >
//                                       <Edit2 className="h-4 w-4" />
//                                     </Button>
//                                     <Button
//                                       variant="ghost"
//                                       size="sm"
//                                       className="h-8 w-8 p-0 text-destructive"
//                                       onClick={() => handleDeleteAddress(address.id || "")}
//                                     >
//                                       <X className="h-4 w-4" />
//                                     </Button>
//                                   </div>
//                                 </div>
//                                 <p className="text-sm mt-1">{address.name}</p>
//                                 <p className="text-sm text-muted-foreground">{address.phone_number}</p>
//                                 <p className="text-sm mt-2">{address.address1}</p>
//                                 {address.address2 && <p className="text-sm mt-2">{address.address2}</p>}
//                                 <p className="text-sm">
//                                   {address.city_name}, {address.state_name} {address.pincode}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                     </RadioGroup>

//                     {/* Billing Address Section */}
//                     <div className="mt-6 pt-4 border-t">
//                       <div className="flex items-center space-x-2 mb-4">
//                         <Checkbox
//                           id="same-address"
//                           checked={useSameAddress}
//                           onCheckedChange={(checked) => setUseSameAddress(checked as boolean)}
//                         />
//                         <Label htmlFor="same-address">Use shipping address for billing</Label>
//                       </div>

//                       {!useSameAddress && (
//                         <>
//                           <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-lg font-semibold">Billing Address</h3>
//                             <Button variant="outline" size="sm" onClick={() => handleAddNewAddress("Billing")}>
//                               <Plus className="h-4 w-4 mr-2" />
//                               Add New
//                             </Button>
//                           </div>

//                           <RadioGroup
//                             value={selectedBillingAddress || ""}
//                             onValueChange={setSelectedBillingAddress}
//                             className="space-y-4"
//                           >
//                             {addresses
//                               .filter((address) => address.address_for === "Billing")
//                               .map((address) => (
//                                 <div
//                                   key={address.id}
//                                   className={`border rounded-lg p-4 ${selectedBillingAddress === address.id ? "border-primary bg-primary/7" : ""
//                                     }`}
//                                 >
//                                   <div className="flex items-start">
//                                     <RadioGroupItem
//                                       value={address.id || ""}
//                                       id={`billing-${address.id}`}
//                                       className="mt-1"
//                                     />
//                                     <div className="ml-3 flex-1">
//                                       <div className="flex justify-between">
//                                         <div className="flex items-center">
//                                           <span className="font-medium">{address.name}</span>
//                                           {address.is_default == "Yes" && (
//                                             <Badge variant="outline" className="ml-2 text-xs">
//                                               Default
//                                             </Badge>
//                                           )}
//                                         </div>
//                                         <div className="flex space-x-2">
//                                           <Button
//                                             variant="ghost"
//                                             size="sm"
//                                             className="h-8 w-8 p-0"
//                                             onClick={() => handleEditAddress(address)}
//                                           >
//                                             <Edit2 className="h-4 w-4" />
//                                           </Button>
//                                           <Button
//                                             variant="ghost"
//                                             size="sm"
//                                             className="h-8 w-8 p-0 text-destructive"
//                                             onClick={() => handleDeleteAddress(address.id || "")}
//                                           >
//                                             <X className="h-4 w-4" />
//                                           </Button>
//                                         </div>
//                                       </div>
//                                       <p className="text-sm mt-1">{address.recipient}</p>
//                                       <p className="text-sm text-muted-foreground">{address.phone}</p>
//                                       <p className="text-sm mt-2">{address.address}</p>
//                                       <p className="text-sm">
//                                         {address.city}, {address.state} {address.zip}
//                                       </p>
//                                       <p className="text-sm">{address.country}</p>
//                                     </div>
//                                   </div>
//                                 </div>
//                               ))}
//                           </RadioGroup>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="border rounded-lg p-4 space-y-4">
//                     <div className="flex justify-between items-center">
//                       <h3 className="font-medium">
//                         {editingAddress
//                           ? "Edit Address"
//                           : `Add New ${newAddress.address_for === "Shipping" ? "Shipping" : "Billing"} Address`}
//                       </h3>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="h-8 w-8 p-0"
//                         onClick={() => {
//                           setAddingNewAddress(false)
//                           setEditingAddress(null)
//                         }}
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="address-name">Name</Label>
//                         <Input
//                           id="address-name"
//                           placeholder="Home, Office, etc."
//                           value={newAddress.name}
//                           onChange={(e) => handleAddressChange(e, "name")}
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="phone">Phone Number</Label>
//                         <Input
//                           id="phone"
//                           type="tel"
//                           placeholder="+91 9876543210"
//                           value={newAddress.phone_number}
//                           onChange={(e) => handleAddressChange(e, "phone_number")}
//                         />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="address">Address1</Label>
//                         <Input
//                           id="address"
//                           placeholder="123 Main St"
//                           value={newAddress.address1}
//                           onChange={(e) => handleAddressChange(e, "address1")}
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="address">Address2</Label>
//                         <Input
//                           id="address"
//                           placeholder="123 Main St"
//                           value={newAddress.address2}
//                           onChange={(e) => handleAddressChange(e, "address2")}
//                         />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-3 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="city">State</Label>
//                         <Select
//                           value={newAddress.state_id}
//                           onValueChange={(value) => {
//                             setSelectedState(value)
//                             setNewAddress({ ...newAddress, state_id: value })
//                           }}
//                         >
//                           <SelectTrigger id="state">
//                             <SelectValue placeholder="Select State" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {states.length > 0 &&
//                               states.map((st: any, index: number) => (
//                                 <SelectItem key={index} value={st.id}>
//                                   {st.name}
//                                 </SelectItem>
//                               ))}
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="city">City</Label>
//                         <Select
//                           value={newAddress.city_id}
//                           onValueChange={(value) => {
//                             setNewAddress({ ...newAddress, city_id: value })
//                           }}
//                         >
//                           <SelectTrigger id="city">
//                             <SelectValue placeholder="Select City" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {cities.length > 0 &&
//                               cities.map((st: any, index: number) => (
//                                 <SelectItem key={index} value={st.id}>
//                                   {st.name}
//                                 </SelectItem>
//                               ))}
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="zip">PIN Code</Label>
//                         <Input
//                           id="zip"
//                           placeholder="400001"
//                           value={newAddress.pincode}
//                           onChange={(e) => handleAddressChange(e, "pincode")}
//                         />
//                       </div>
//                     </div>

//                     <div className="flex items-center space-x-2 pt-2">
//                       <Checkbox
//                         id="default-address"
//                         checked={newAddress.is_default == "Yes"}
//                         onCheckedChange={(checked) =>
//                           setNewAddress({
//                             ...newAddress,
//                             is_default: (checked as boolean) ? "Yes" : "No",
//                           })
//                         }
//                       />
//                       <Label htmlFor="default-address" className="text-sm font-normal">
//                         Set as default {newAddress.address_for} address
//                       </Label>
//                     </div>

//                     <div className="flex space-x-3 pt-2">
//                       <Button
//                         variant="outline"
//                         className="flex-1"
//                         onClick={() => {
//                           setAddingNewAddress(false)
//                           setEditingAddress(null)
//                         }}
//                       >
//                         Cancel
//                       </Button>
//                       <Button className="flex-1" onClick={handleSaveAddress}>
//                         Save Address
//                       </Button>
//                     </div>
//                   </div>
//                 )}

               
//               </CardContent>
//             </Card>

//             {/* Delivery Options */}
      

//             {/* Payment Method */}
//             <Card>
//               <CardContent className="p-6">
//                 <h2 className="text-xl font-semibold flex items-center mb-4">
//                   <CreditCard className="h-5 w-5 mr-2" />
//                   Payment Method
//                 </h2>

//                 <RadioGroup
//                   value={paymentMethod}
//                   onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
//                   className="space-y-4"
//                 >
//                   <div
//                     className={`border rounded-lg p-4 ${paymentMethod === "razorpay" ? "border-primary bg-primary/7" : ""
//                       }`}
//                   >
//                     <div className="flex items-start">
//                       <RadioGroupItem value="razorpay" id="payment-razorpay" className="mt-1" />
//                       <div className="ml-3 flex-1">
//                         <div className="flex justify-between">
//                           <div className="flex items-center">
//                             {/* <CreditCard className="h-5 w-5 mr-2" /> */}
//                             <span className="font-medium">Pay Online </span>
//                           </div>
//                         </div>
//                         <p className="text-sm text-muted-foreground mt-1">Pay securely with Razorpay</p>
//                         <div className="flex items-center mt-2 space-x-2">
//                           <div className="h-6 w-10 bg-muted rounded flex items-center justify-center text-xs font-medium">
//                             VISA
//                           </div>
//                           <div className="h-6 w-10 bg-muted rounded flex items-center justify-center text-xs font-medium">
//                             UPI
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div
//                     className={`border rounded-lg p-4 ${paymentMethod === "cod" ? "border-primary bg-primary/7" : ""}`}
//                   >
//                     <div className="flex items-start">
//                       <RadioGroupItem value="cod" id="payment-cod" className="mt-1" />
//                       <div className="ml-3 flex-1">
//                         <div className="flex justify-between">
//                           <div className="flex items-center">
//                             {/* <DollarSign className="h-5 w-5 mr-2" /> */}
//                             <span className="font-medium">Cash on Delivery</span>
//                           </div>
//                         </div>
//                         <p className="text-sm text-muted-foreground mt-1">Pay when you receive your order</p>
//                       </div>
//                     </div>
//                   </div>
//                 </RadioGroup>

//                 {/* Coupon Section */}
//                 <div className="mt-6 border rounded-lg p-4">
//                   <h3 className="font-medium mb-3 flex items-center">
//                     <Ticket className="h-4 w-4 mr-2" />
//                     {appliedCoupon ? "Applied Coupon" : "Apply Coupon"}
//                   </h3>

//                   {appliedCoupon ? (
//                     <div className="bg-green-50 border border-green-100 rounded-md p-3">
//                       <div className="flex justify-between items-center">
//                         <div className="flex items-center">
//                           <Check className="h-5 w-5 text-green-500 mr-2" />
//                           <div>
//                             <p className="font-medium text-green-700">Coupon Applied: {appliedCoupon.code}</p>
//                             <p className="text-sm text-green-600">
//                               You saved {formatCurrency(discount)}
//                               {appliedCoupon.discount_type === "percentage" &&
//                                 ` (${appliedCoupon.discount_value}% off)`}
//                             </p>
//                           </div>
//                         </div>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="h-8 text-red-500 hover:text-red-700"
//                           onClick={handleRemoveCoupon}
//                         >
//                           Remove
//                         </Button>
//                       </div>
//                     </div>
//                   ) : (
//                     <>
//                       <div className="flex gap-2">
//                         <div className="flex-1">
//                           <Input
//                             placeholder="Enter coupon code"
//                             value={couponCode}
//                             onChange={(e) => setCouponCode(e.target.value)}
//                             onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
//                           />
//                         </div>
//                         <Button onClick={handleApplyCoupon} disabled={isApplyingCoupon || !couponCode.trim()}>
//                           {isApplyingCoupon ? (
//                             <>
//                               <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                               Applying
//                             </>
//                           ) : (
//                             "Apply"
//                           )}
//                         </Button>
//                       </div>

//                       <Button 
//                         variant="outline" 
//                         className="w-full mt-3" 
//                         onClick={() => setIsOpenCoupon(true)}
//                       >
//                         <Ticket className="h-4 w-4 mr-2" />
//                         View Available Coupons
//                       </Button>
//                     </>
//                   )}

//                   {couponError && (
//                     <div className="mt-2 text-sm text-red-500 flex items-center">
//                       <X className="h-4 w-4 mr-1" />
//                       {couponError}
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex items-center mt-6 p-4 rounded-lg bg-muted/30">
//                   <Shield className="h-5 w-5 text-muted-foreground mr-3" />
//                   <p className="text-sm text-muted-foreground">
//                     Your payment information is processed securely. We do not store credit card details.
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="lg:col-span-1">
//             <div className="border rounded-lg overflow-hidden sticky top-24">
//               <div className="bg-muted px-4 py-3 font-medium">Order Summary</div>

//               <div className="p-6">
//                 <Accordion type="single" collapsible defaultValue="items">
//                   <AccordionItem value="items" className="border-none">
//                     <AccordionTrigger className="py-2">
//                       {items.length} {items.length === 1 ? "item" : "items"} in cart
//                     </AccordionTrigger>
//                     <AccordionContent>
//                       <ul className="space-y-4 mb-4">
//                         {checkoutItems.map((item) => (
//                           <li key={item.id} className="flex flex-col">
//                             <div className="flex">
//                               <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
//                                 <SafeImage
//                                   src={item.variantId && item.color
//                           ? `${image_base_url}/storage/products/${item.id}/variants/thumbnail/tiny_${item.image}`
//                           : `${image_base_url}/storage/products/${item.id}/thumbnail/tiny_${item.image}`
//                         }
//                                   alt={item.name}
//                                   width={64}
//                                   height={64}
//                                   className="w-full h-full object-fit"
//                                 />
//                               </div>

//                               <div className="ml-4 flex-1">
//                                 <h4 className="text-sm font-medium">{item.name}</h4>
//                                 <p className="text-xs text-muted-foreground">
//                                   {item.size && `Size: ${item.size}`}
//                                   {item.size && item.color && " | "}
//                                   {item.color && `Color: ${item.color}`}
//                                 </p>
//                                 <div className="flex justify-between mt-1">
//                                   <span className="text-xs">Qty: {item.quantity}</span>
//                                   <span className="text-sm font-medium">
//                                     {formatCurrency(item.sale_price * item.quantity)}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
                          
//                           </li>
//                         ))}
//                       </ul>

//                       {/* Show applied coupon in order summary */}
//                       {appliedCoupon && (
//                         <div className="mt-2 pt-2 border-t">
//                           <div className="flex items-center justify-between text-sm">
//                             <div className="flex items-center text-green-600">
//                               <Ticket className="h-4 w-4 mr-1" />
//                               <span>Coupon: {appliedCoupon.code}</span>
//                             </div>
//                             <span className="text-green-600">-{formatCurrency(discount)}</span>
//                           </div>
//                         </div>
//                       )}
//                     </AccordionContent>
//                   </AccordionItem>
//                 </Accordion>

//                 <div className="space-y-2 py-4 border-t border-b">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Subtotal</span>
//                     <span>{formatCurrency(subtotal)}</span>
//                   </div>

//                   {discount > 0 && (
//                     <div className="flex justify-between text-green-600">
//                       <span>Discount</span>
//                       <span>-{formatCurrency(discount)}</span>
//                     </div>
//                   )}

//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Shipping</span>
//                     <span>
//                      {formatCurrency(shipping_cost)}
//                     </span>
//                   </div>

//                   <div className="flex justify-between font-medium text-lg pt-2">
//                     <span>Total</span>
//                     <span>
                     
//                       {formatCurrency(total+shipping_cost)}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mt-6">
//                   <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isProcessingOrder}>
//                     {isProcessingOrder ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Processing Order...
//                       </>
//                     ) : (
//                       `Place Order${paymentMethod === "cod" ? " (Cash on Delivery)" : ""}`
//                     )}
//                   </Button>

//                   <p className="text-xs text-muted-foreground text-center mt-4">
//                     By placing your order, you agree to our{" "}
//                     <Link href="/terms" className="text-primary hover:underline">
//                       Terms of Service
//                     </Link>{" "}
//                     and{" "}
//                     <Link href="/privacy" className="text-primary hover:underline">
//                       Privacy Policy
//                     </Link>
//                     .
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Coupon Dialog for Desktop */}
//       <Dialog open={isOpenCoupon} onOpenChange={setIsOpenCoupon}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Available Coupons</DialogTitle>
//             <DialogDescription>Select a coupon to apply to your order</DialogDescription>
//           </DialogHeader>
//           <CouponsContent />
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }
