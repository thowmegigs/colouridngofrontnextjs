// "use client"

// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// import { sendOTP } from "@/lib/api"
// import { CheckCircle, Loader2, X, XCircle } from "lucide-react"
// import { useEffect, useState } from "react"
// import { useAuth } from "../providers/auth-provider"
// import { showToast as toast } from "./show-toast"

// interface AuthModalProps {
//   isOpen: boolean
//   onClose: () => void
//   onSuccess: () => void
//   couponCode?: string
//   initialView: "login" | "register"
// }

// export function AuthModal({ isOpen, onClose, onSuccess, couponCode, initialView }: AuthModalProps) {
//   const [activeTab, setActiveTab] = useState<"login" | "register">(initialView)

//   // Login States
//   const [phoneNumber, setPhoneNumber] = useState("")
//   const [otpSent, setOtpSent] = useState(false)
//   const [otp, setOtp] = useState("")
//   const [countdown, setCountdown] = useState(0)
//   const [user_id, setUserId] = useState("")
//   // Register States
//   const [name, setName] = useState("")
//   const [email, setEmail] = useState("")
//   const [regPhoneNumber, setRegPhoneNumber] = useState("")
//   const [emailOtp, setEmailOtp] = useState("")
//   const [phoneOtp, setPhoneOtp] = useState("")
//   const [emailOtpSent, setEmailOtpSent] = useState(false)
//   const [phoneOtpSent, setPhoneOtpSent] = useState(false)
//   const [emailVerified, setEmailVerified] = useState(null)
//   const [phoneVerified, setPhoneVerified] = useState(null)
//   const [emailCountdown, setEmailCountdown] = useState(0)
//   const [phoneCountdown, setPhoneCountdown] = useState(0)
//   const [verifyingEmail, setVerifyingEmail] = useState(false)
//   const [verifyingPhone, setVerifyingPhone] = useState(false)


//   const [loading, setLoading] = useState(false)

//   const { login, verifyOtp, isLoading, verifyRegOtp,register } = useAuth()

//   useEffect(() => {
//     if (countdown > 0) {
//       const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
//       return () => clearTimeout(timer)
//     }
//   }, [countdown])

//   useEffect(() => {
//     if (emailCountdown > 0) {
//       const timer = setTimeout(() => setEmailCountdown(emailCountdown - 1), 1000)
//       return () => clearTimeout(timer)
//     }
//   }, [emailCountdown])

//   useEffect(() => {
//     if (phoneCountdown > 0) {
//       const timer = setTimeout(() => setPhoneCountdown(phoneCountdown - 1), 1000)
//       return () => clearTimeout(timer)
//     }
//   }, [phoneCountdown])

//   const handleSendOTP = async () => {
//     if (!phoneNumber || phoneNumber.length < 10) {
//       toast({ title: "Invalid Phone Number", variant: "destructive" })
//       return
//     }

//     setLoading(true)
//     try {
//       const response: any = await login(phoneNumber)

//       if (response.success) {
//         setOtpSent(true)
//         setUserId(response.userId)
//         setCountdown(30)
//         toast({ title: "OTP Sent", description: "Check your phone" })
//       } else {
//         toast({ title: "Failed", description: response.message, variant: "destructive" })
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleVerifyOTP = async () => {
//     if (!otp || otp.length !== 6) {
//       toast({ title: "Invalid OTP", variant: "destructive" })
//       return
//     }

//     setLoading(true)
//     try {
//       const response = await verifyOtp(phoneNumber, otp)
//       if (response.success) {
//         toast({ title: "Login Successful" })
//         onSuccess()
//         onClose()
//       } else {
//         toast({ title: "Invalid OTP", description: response.message, variant: "destructive" })
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   // ---------- Registration OTP Handlers ----------

//   const handleSendRegOtp = async (type: "email" | "phone") => {
//     const target = type === "email" ? email : regPhoneNumber
//     if (!target) return

//     setLoading(true)
//     try {
//       const response = await sendOTP(type, target, 'register')

//       if (response.success) {
//         type === "email" ? setEmailOtpSent(true) : setPhoneOtpSent(true)
//         type === "email" ? setEmailCountdown(30) : setPhoneCountdown(30)
//         toast({ title: ` OTP Sent to your ${type}` })
//       } else {
//         toast({ title: "Failed to send OTP", description: response.message, variant: "destructive" })
//       }
//     } catch (error: any) {
//       // console.log('here er',error.response.data.message)
//       toast({ title: "Failed to send OTP", description: error.response.data.message, variant: "destructive" })


//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleVerifyRegOtp = async (type: "email" | "phone") => {
//     const target = type === "email" ? email : regPhoneNumber
//     const code = type === "email" ? emailOtp : phoneOtp
//     if (!code || code.length !== 6) return

//     type==='email'?setVerifyingEmail(true):setVerifyingPhone(true)
//     try {
//       const response = await verifyRegOtp(code, type, target)
//       if (response.success) {
//         type === "email" ? setEmailVerified(true) : setPhoneVerified(true)
//         toast({ title: `${type.toUpperCase()} Verified` })
//       }
//       else {
//         toast({ title: `OTP Verification failed`, description: response.message })
//       }
//     } catch (error: any) {
//       toast({ title: `Otp verification failed`, description: error.response.data.message, variant: 'destructive' })
//     } finally {
//       type==='email'?setVerifyingEmail(false):setVerifyingPhone(false)
//     }
//   }

//   const handleRegister = async () => {
//     if (!name || !email || !regPhoneNumber) {
//       toast({ title: "Missing fields", variant: "destructive" })
//       return
//     }

//     if (!emailVerified || !phoneVerified) {
//       toast({ title: "Verify email and phone first", variant: "destructive" })
//       return
//     }

//     setLoading(true)
//     try {
//       const response = await register(name, email, regPhoneNumber)
//       if (response.success) {
//         toast({ title: "Registration Successful" })
//         setPhoneNumber(regPhoneNumber)
//         setActiveTab("login")
//       } else {
//         toast({ title: "Registration Failed", description: response.message, variant: "destructive" })
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle className="text-center text-xl font-bold">
//             {couponCode ? "Login to Apply Coupon" : "Login or Register"}
//           </DialogTitle>
//         </DialogHeader>
//         <button
//           onClick={onClose}
//           className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none"
//         >
//           <X className="h-4 w-4" />
//         </button>

//         <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")} className="w-full">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="login">Login</TabsTrigger>
//             <TabsTrigger value="register">Register</TabsTrigger>
//           </TabsList>

//           {/* ---------------- LOGIN TAB ---------------- */}
//           <TabsContent value="login" className="space-y-4 py-4">
//             {!otpSent ? (
//               <div className="space-y-4">
//                 <Label htmlFor="phone">Phone</Label>
//                 <Input
//                  placeholder="Enter  phone no."
//                  id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
//                 <Button onClick={handleSendOTP} disabled={loading || phoneNumber.length < 10} className="w-full">
//                   {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
//                 </Button>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <Label>OTP</Label>
//                 <Input value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
//                 <p className="text-xs">
//                   OTP sent to {phoneNumber}.{" "}
//                   {countdown > 0 ? `Resend in ${countdown}s` : (
//                     <button onClick={handleSendOTP} className="text-blue-500 underline">Resend</button>
//                   )}
//                 </p>
//                 <div className="flex gap-2">
//                   <Button variant="outline" onClick={() => setOtpSent(false)} className="flex-1">Back</Button>
//                   <Button onClick={handleVerifyOTP} disabled={loading || otp.length !== 6} className="flex-1">
//                     {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Login"}
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </TabsContent>

//           {/* ---------------- REGISTER TAB ---------------- */}
//           <TabsContent value="register" className="space-y-4 py-4">
//             <Label>Full Name</Label>
//             <Input  placeholder="Enter full name" value={name} onChange={(e) => setName(e.target.value)} />

//             <div className="space-y-2">
//               <Label>Email</Label>
//               <div className="relative">
//                 <Input
//                  placeholder="Enter email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="pr-28"
//                 />
//                 <Button
//                   size="sm"
//                   className="absolute right-1 bg-gray-200 hover:bg-gray-300 text-[12px] text-black transition-colors duration-200 top-1/2 -translate-y-1/2 px-3 py-1  h-6"
//                   onClick={() => handleSendRegOtp("email")}
//                   disabled={emailCountdown > 0}
//                 >
//                   {emailCountdown > 0 ? `Resend in ${emailCountdown}s` : "Send OTP"}
//                 </Button>
//                 {emailVerified !== null && (
//                   <span className="absolute right-32 top-1/2 -translate-y-1/2">
//                     {emailVerified ? (
//                       <CheckCircle className="text-green-500" />
//                     ) : (
//                       <XCircle className="text-red-500" />
//                     )}
//                   </span>
//                 )}
//               </div>

//               <div className="flex gap-2 items-center">
//                 <Input
//                   placeholder="Enter OTP"
//                   value={emailOtp}
//                   onChange={(e) => setEmailOtp(e.target.value)}
//                   className="flex-1"
//                 />
//                 <Button
//                   size="sm"
//                   className="px-2 py-1"
//                   onClick={() => handleVerifyRegOtp("email")}
//                   disabled={emailOtp.length !== 6}
//                 >
//                   {verifyingEmail ? <Loader2 className="h-2 w-2 animate-spin" /> : "Verify"}
//                 </Button>
//               </div>
//             </div>


//             <div className="space-y-2">
//               <Label>Phone Number</Label>
//               <div className="relative">
//                 <Input
//                 placeholder="Enter  phone no."
//                   value={regPhoneNumber}
//                   onChange={(e) => setRegPhoneNumber(e.target.value)}
//                   className="pr-28"
//                 />
//                 <Button
//                   size="sm"
//                   className="absolute right-1 bg-gray-200 hover:bg-gray-300 text-[12px] text-black transition-colors duration-200 top-1/2 -translate-y-1/2 px-3 py-1  h-6"
//                   onClick={() => handleSendRegOtp("phone")}
//                   disabled={phoneCountdown > 0}
//                 >
//                   {phoneCountdown > 0 ? `Resend in ${phoneCountdown}s` : "Send OTP"}
//                 </Button>
//                 {phoneVerified !== null && (
//                   <span className="absolute right-32 top-1/2 -translate-y-1/2">
//                     {phoneVerified ? (
//                       <CheckCircle className="text-green-500" />
//                     ) : (
//                       <XCircle className="text-red-500" />
//                     )}
//                   </span>
//                 )}
//               </div>

//               <div className="flex gap-2 items-center">
//                 <Input
//                   placeholder="Enter OTP"
//                   value={phoneOtp}
//                   onChange={(e) => setPhoneOtp(e.target.value)}
//                   className="flex-1"
//                 />
//                 <Button
//                   size="sm"
//                   className="px-2 py-1 "
//                   onClick={() => handleVerifyRegOtp("phone")}
//                   disabled={phoneOtp.length !== 6}
//                 >
//                   {verifyingPhone ? <Loader2 className="h-2 w-2 animate-spin" /> : "Verify"}
//                 </Button>
//               </div>
//             </div>


//             <Button onClick={handleRegister} disabled={loading || !emailVerified || !phoneVerified} className="w-full">
//               {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Register"}
//             </Button>
//           </TabsContent>
//         </Tabs>
//       </DialogContent>
//     </Dialog>
//   )
// }
