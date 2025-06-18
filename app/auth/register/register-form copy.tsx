// "use client"

// import { useAuth } from "@/app/providers/auth-provider"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { sendOTP } from "@/lib/api"
// import { Loader2 } from "lucide-react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { useEffect, useRef, useState } from "react"

// export default function RegisterForm() {
//   const [name, setName] = useState("")
//   const [email, setEmail] = useState("")
//   const [phone, setPhone] = useState("")
//   const [emailOtp, setEmailOtp] = useState("")
//   const [phoneOtp, setPhoneOtp] = useState("")
//   const [error, setError] = useState("")
//   const [success, setSuccess] = useState("")
//   const [acceptTerms, setAcceptTerms] = useState(false)
//   const [isEmailVerified, setIsEmailVerified] = useState(false)
//   const [isPhoneVerified, setIsPhoneVerified] = useState(false)
//   const errorRef = useRef<HTMLDivElement>(null);
//   const { register,verifyRegOtp, isLoading } = useAuth()
//   const router = useRouter()
//   useEffect(() => {
//     if (error && errorRef.current) {
//       errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     }
//     else if (success && errorRef.current) {
//       errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     }
//   }, [error,success]);
//   useEffect(() => {
//     setError("")
//     setSuccess("")
//   }, [emailOtp, phoneOtp])

//   const handleSendEmailOtp = async () => {
//     if (!email) return setError("Enter email to send OTP")
//     try {
//       const res = await sendOTP("email", email, "register")
//       if (res.success) {
//         setSuccess("Email OTP sent")
//         setError("")
//       } else {
//         setError(res.message)
//       }
//     } catch (err: any) {
//       console.log('here i got',err)
//       setError(err.response.data.message || "Failed to send Email OTP")
//     }
//   }

//   const handleSendPhoneOtp = async () => {
//     if (!phone) return setError("Enter phone to send OTP")
//     try {
//       const res = await sendOTP("phone", phone, "register")
//       if (res.success) {
//         setSuccess("Phone OTP sent")
//         setError("")
//       } else {
//         setError(res.message)
//       }
//     } catch (err: any) {
//       console.log('in side', err)
//       setError(err.response.data.message || "Failed to send Phone OTP")
//     }
//   }

//   const handleEmailOtpVerify = async () => {
//     if (!emailOtp) return setError("Enter email OTP")
//     try {
//       const response = await verifyRegOtp(emailOtp, "email", email)
//       if (response.success) {
//         setIsEmailVerified(true)
//         setSuccess("Email OTP verified")
//       } else {
//         setError(response.message)
//       }
//     } catch (err: any) {
//       setError(err.message || "Invalid Email OTP")
//     }
//   }

//   const handlePhoneOtpVerify = async () => {
//     if (!phoneOtp) return setError("Enter phone OTP")
//     try {
//       const response = await verifyRegOtp(phoneOtp, "phone", phone)
//       if (response.success) {
//         setIsPhoneVerified(true)
//         setSuccess("Phone OTP verified")
//       } else {
//         setError(response.message)
//       }
//     } catch (err: any) {
//       setError(err.message || "Invalid Phone OTP")
//     }
//   }

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!acceptTerms) return setError("You must accept the terms and privacy policy")
//     if (!isEmailVerified || !isPhoneVerified)
//       return setError("Please verify both Email and Phone before registering")

//     try {
//       const response = await register(name, email, phone)
//       if (response.success) {
//         setError(null)
//         setSuccess("Registered successfully! Redirecting to login...")
//         setTimeout(() => {
//           router.push("/auth/login")
//         }, 4000)
//       } else {
//         setError(response.message)

//       }
//     } catch (err: any) {
//       setError(err.message || "Registration failed")
//     }
//   }

//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader>
//         <CardTitle className="text-2xl font-bold text-center">Customer Registration</CardTitle>
//         <CardDescription className="text-center">Create a new customer account</CardDescription>
//       </CardHeader>
//       <CardContent>
//         {error && (
//           <div ref={errorRef} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
//         )}
//         {success && (
//           <div ref={errorRef} className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">{success}</div>
//         )}

//         <form onSubmit={handleRegister} className="space-y-4">
//           {/* Name */}
//           <div className="space-y-2">
//             <Label htmlFor="name">Full Name*</Label>
//             <Input
//               id="name"
//               type="text"
//               placeholder="Enter your full name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>

//           {/* Email */}
//           <div className="space-y-2">
//             <Label htmlFor="email">Email Address*</Label>
//             <div className="relative">
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => {
//                   setEmail(e.target.value)
//                   setIsEmailVerified(false)
//                 }}
//                 className="pr-28" // space for button
//               />
//               <Button
//                 type="button"
//                 variant="secondary"
//                 onClick={handleSendEmailOtp}
//                 className="absolute right-0 top-0 h-full rounded-l-none m-[7px] h-[27px] text-[12px] "
//               >
//                 Send OTP
//               </Button>
//             </div>
//             <div className="relative">
//               <Input
//                 id="email-otp"
//                 type="text"
//                 placeholder="Enter Email OTP"
//                 maxLength={6}
//                 value={emailOtp}
//                 onChange={(e) => setEmailOtp(e.target.value)}
//                 className="pr-28 "
//               />
//               <Button
//                 type="button"
//                 variant="secondary"
//                 onClick={handleEmailOtpVerify}
//                 disabled={isEmailVerified}
//                 className="absolute right-0 top-0 h-full rounded-l-none m-[7px] h-[27px] text-[12px] "
//               >
//                 {isEmailVerified ? "✅ OTP Verified" : "Verify"}
//               </Button>
//             </div>
//           </div>

//           {/* Phone */}
//           <div className="space-y-2">
//             <Label htmlFor="phone">Phone Number*</Label>
//             <div className="relative">
//               <Input
//                 id="phone"
//                 type="tel"
//                 placeholder="Enter your phone number"
//                 value={phone}
//                 onChange={(e) => {
//                   setPhone(e.target.value)
//                   setIsPhoneVerified(false)
//                 }}
//                 className="pr-28"
//               />
//               <Button
//                 type="button"
//                 variant="secondary"
//                 onClick={handleSendPhoneOtp}
//                 className="absolute right-0 top-0 h-full rounded-l-none  m-[7px] h-[27px] text-[12px]"
//               >
//                 Send OTP
//               </Button>
//             </div>
//             <div className="relative">
//               <Input
//                 id="phone-otp"
//                 type="text"
//                 placeholder="Enter Phone OTP"
//                 maxLength={6}
//                 value={phoneOtp}
//                 onChange={(e) => setPhoneOtp(e.target.value)}
//                 className="pr-28"
//               />
//               <Button
//                 type="button"
//                 variant="secondary"
//                 onClick={handlePhoneOtpVerify}
//                 disabled={isPhoneVerified}
//                 className="absolute right-0 top-0 h-full rounded-l-none  m-[7px] h-[27px] text-[12px]"
//               >
//                 {isPhoneVerified ? "✅ OTP Verified" : "Verify"}
//               </Button>
//             </div>
//           </div>

//           {/* Terms & Submit */}
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               id="terms"
//               checked={acceptTerms}
//               onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
//             />
//             <Label htmlFor="terms" className="text-sm text-gray-700">
//               I agree to the{" "}
//               <Link href="/terms" className="text-primary-600 hover:text-primary-500">
//                 Terms of Service
//               </Link>{" "}
//               and{" "}
//               <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
//                 Privacy Policy
//               </Link>
//             </Label>
//           </div>

//           <Button
//             type="submit"
//             className="w-full bg-primary-600 hover:bg-primary-700"
//             disabled={isLoading || !isEmailVerified || !isPhoneVerified || !acceptTerms}
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Registering...
//               </>
//             ) : (
//               "Register"
//             )}
//           </Button>
//         </form>
//       </CardContent>
//       <CardFooter className="flex justify-center">
//         <p className="text-sm text-gray-600">
//           Already have an account?{" "}
//           <Link href="/auth/login" className="text-primary-600 hover:text-primary-500">
//             Sign in
//           </Link>
//         </p>
//       </CardFooter>
//     </Card>
//   )
// }
