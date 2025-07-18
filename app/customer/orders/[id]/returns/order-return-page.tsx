"use client"

import type React from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import { AlertCircle, Check, Loader2, Upload, X } from "lucide-react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import SafeImage from "@/app/components/SafeImage"
import { showToast } from "@/app/components/show-toast"
import { image_base_url } from "@/contant"
import { fetchOrderById } from "@/lib/api"
import { createReturn, type ReturnCondition, type ReturnMethod, type ReturnReason } from "@/lib/return-api"
import { colorNameToHex } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"

export default function OrderReturnPage({ orderId }: any) {
  const router = useRouter()

  const searchParams = useSearchParams()
  // From dynamic route
  const itemId: any = searchParams.get('itemId')

  const fileInputRef = useRef<HTMLInputElement>(null)
 
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [reason, setReason] = useState<ReturnReason>("defective")
  const [condition, setCondition] = useState<ReturnCondition>("unopened")
  const [description, setDescription] = useState("")
  const [returnMethod, setReturnMethod] = useState<ReturnMethod>("original")
  

  // Image upload state
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
 
  // Fetch order data
  // Fetch order data
  const {
    data: order,
    isLoading,
    error: fetchError,
  } = useQuery<any>({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: !!orderId,
  })

  // Get the item from the order

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const newFiles = Array.from(e.target.files)

    // Check if adding these files would exceed the limit
    if (images.length + newFiles.length > 4) {
      showToast({
        title: "Maximum 4 images allowed",
        description: `You can only upload a maximum of 4 images. You've selected ${images.length + newFiles.length}.`,
        variant: "destructive",
      })
      return
    }

    // Add new files
    setImages((prev) => [...prev, ...newFiles])

    // Create URLs for preview
    const newUrls = newFiles.map((file) => URL.createObjectURL(file))
    setImageUrls((prev) => [...prev, ...newUrls])

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Handle QR code upload
 

  // Remove image
  const removeImage = (index: number) => {
    const newImages = [...images]
    const newUrls = [...imageUrls]

    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(newUrls[index])

    newImages.splice(index, 1)
    newUrls.splice(index, 1)

    setImages(newImages)
    setImageUrls(newUrls)
  }

  

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    // if (!description.trim()) {
    //   showToast({
    //     title: "Description required",
    //     description: "Please provide details about why you're returning this item.",
    //     variant: "destructive",
    //   })
    //   return
    // }

    if (images.length === 0) {
      showToast({
        title: "Images required",
        description: "Please upload at least one image of the item you want to return.",
        variant: "destructive",
      })
      return
    }

    
    try {
      setSubmitting(true)
      setError(null)

      // Create FormData for file upload
      const formData = new FormData()
      formData.append("orderId", orderId)
      formData.append("reason", reason)
      formData.append("condition", condition)
      formData.append("description", description)
      formData.append("returnMethod", returnMethod)
      formData.append("itemId", itemId)

      // Add UPI ID if applicable
     

      // Add images
      images.forEach((image) => {
        formData.append("images", image)
      })

      // Submit return request
      const response = await createReturn(formData)

      // Show success message
    console.log('res',response)
      if (!response.success) {
        showToast({

          description: response.message,
          variant: "destructive",
        })
        return
      }
      else {
          setSuccess(true)

        showToast({
         
          description: "Your return request has been submitted successfully.",
        })
        setTimeout(() => {
          router.replace(`/customer/returns/${response.data.returnId}`)
        }, 2000)
      }

      // Redirect to return details page after a delay

    } catch (err) {
      console.log("Error submitting return:", err)
      console.log("Error submitting return:", err.response)
      console.log("Error submitting return:", err.responseJSON)
      //  setError("Failed to submit return request. Please try again.")
      showToast({
        title: "Submission failed",
        description: "There was an error submitting your return request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url))
    
    }
  }, [imageUrls])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading order details...</span>
      </div>
    )
  }

  if (fetchError || error) {
    return (
      <Alert variant="destructive" className="max-w-3xl mx-auto my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || "Failed to load order details"}</AlertDescription>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </Alert>
    )
  }

  if (success) {
    return (
      <Alert variant="default" className="max-w-3xl mx-auto my-8 bg-green-50 border-green-200">
        <Check className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Return Request Submitted</AlertTitle>
        <AlertDescription className="text-green-700">
          Your return request has been submitted successfully. You will be redirected to the return details page.
        </AlertDescription>
      </Alert>
    )
  }
  const orderItem = order?.items?.find((item: any) => item.order_item_id == itemId)
  const attributes_ar = orderItem?.variant_attributes ? JSON.parse(orderItem.variant_attributes) : []

  if (!order || !orderItem) {
    return (
      <Alert variant="destructive" className="max-w-3xl mx-auto my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Item Not Found</AlertTitle>
        <AlertDescription>
          The item you are trying to return does not exist or you do not have permission to return it.
        </AlertDescription>
        <Button variant="outline" className="mt-4" onClick={() => router.push(`/customer/orders/${orderId}`)}>
          Back to Order
        </Button>
      </Alert>
    )
  }

  // Check if the item is already returned
  if (orderItem.returned) {
    return (
      <Alert className="max-w-3xl mx-auto my-8 bg-yellow-50 border-yellow-200">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Item Already Returned</AlertTitle>
        <AlertDescription className="text-yellow-700">
          This item has already been returned. You cannot create another return request for it.
        </AlertDescription>
        <Button variant="outline" className="mt-4" onClick={() => router.push(`/customer/orders/${orderId}`)}>
          Back to Order
        </Button>
      </Alert>
    )
  }
  const imageurl = orderItem?.variant_id
    ? `${image_base_url}/storage/products/${orderItem?.product_id}/variants/${orderItem?.variant_image}`
    : `${image_base_url}/storage/products/${orderItem?.product_id}/${orderItem?.product_image}`
  const original_attributes = orderItem?.original_atributes
    ? JSON.parse(orderItem?.original_atributes) : null

  return (
    <div className="container max-w-4xl p-0 m-0 ">
      <div className="mb-1">
        <p className="text-muted-foreground font-bold">
          For Order #{order.orderId}
        </p>
      </div>

      {/* Item Information */}
      <Card className="mb-2 ">
        <CardHeader>
          <CardTitle className="text-lg">Item to Return</CardTitle>
          <CardDescription>You are returning the following item.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4 p-4 bg-muted/20 rounded-lg">
            <div className="flex-shrink-0 w-16 h-16 relative">
              <SafeImage
                src={imageurl}
                alt={orderItem.name}
                fill
                className="object-fit rounded-md"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium line-clamp-2 text-md">{orderItem.name}</h3>
              <h3 className="font-medium line-clamp-2 text-sm text-primary">{orderItem.vendor_name}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {original_attributes?.Size && <span className="text-xs font-semibold bg-gray-200 p-1 text-black">Size: {original_attributes?.Size}</span>}
                {original_attributes?.Color && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold bg-gray-100 p-1 text-black">Color: {original_attributes?.Color}</span>
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: colorNameToHex(original_attributes?.Color) || "#ccc" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Return Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Return Details</CardTitle>
              <CardDescription>Tell us why you're returning this item.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Return</Label>
                <Select value={reason} onValueChange={(value: ReturnReason) => setReason(value)}>
                  <SelectTrigger id="reason">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="defective">Defective/Damaged Product</SelectItem>
                    <SelectItem value="wrong-item">Wrong Item Received</SelectItem>
                    <SelectItem value="not-as-described">Not as Described</SelectItem>
                    <SelectItem value="better-price">Found Better Price Elsewhere</SelectItem>
                    <SelectItem value="no-longer-needed">No Longer Needed</SelectItem>
                    <SelectItem value="accidental-order">Accidental Order</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Item Condition</Label>
                <Select value={condition} onValueChange={(value: ReturnCondition) => setCondition(value)}>
                  <SelectTrigger id="condition">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unopened">Unopened/Unused</SelectItem>
                    <SelectItem value="opened">Opened but Unused</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Additional Details</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide more details about your return reason..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  
                />
              </div>
            </CardContent>
          </Card>

          {/* Upload Images */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Images</CardTitle>
              <CardDescription>Upload up to 4 images of the item you're returning (required).</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square border rounded-md overflow-hidden">
                      <Image
                        src={url || "/placeholder.svg"}
                        alt={`Return image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {images.length < 4 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square border-2 border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                    >
                      <Upload className="h-8 w-8 mb-2" />
                      <span className="text-sm">Add Image</span>
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  multiple
                />

                <p className="text-sm text-muted-foreground">
                  {images.length}/4 images uploaded. Please upload clear images showing the issue or condition.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Refund Method */}
          <Card>
            <CardHeader>
              <CardTitle>Refund Method</CardTitle>
              <CardDescription>Choose how you would like to receive your refund.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={returnMethod}
                onValueChange={(value: ReturnMethod) => setReturnMethod(value)}
                className="space-y-4"
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="Original" id="original" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="original" className="font-medium">
                      Original Payment Method
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Refund will be processed to the original payment method used for the order.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="Bank" id="store-credit" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="store-credit" className="font-medium">
                      Bank/Upi Account
                    </Label>
                     <p className="text-sm text-muted-foreground">
                      Receive refund in the account details added in Colourindigo panel
                      
                    </p>
                   <Link href="/customer/payment" className="text-xs text-primary">Add/Update Bank Acount here</Link>
                   
                  </div>
                </div>

               
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Return Request"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
