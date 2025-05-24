"use client"

import type React from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

import { SizeSelector } from "@/app/components/size-selector"
import { formatCurrency } from "@/app/lib/utils"
import { fetchOrderById } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { Check, Loader2, Upload, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

// Dummy order data
const DUMMY_ORDER = {
  orderId: "ORD12345",
  created_at: "2023-05-15T10:30:00Z",
  items: [
    {
      order_item_id: "ITEM789",
      product_id: "PROD456",
      name: "Premium Cotton T-Shirt",
      image: "/plain-white-tshirt.png",
      size: "M",
      color: "Blue",
      qty: 1,
      sale_price: 1299,
      returned: false,
    },
  ],
}

// Dummy product variants
const DUMMY_VARIANTS = [
  { size: "XS", stock: 5 },
  { size: "S", stock: 3 },
  { size: "M", stock: 0 }, // Current size, out of stock
  { size: "L", stock: 8 },
  { size: "XL", stock: 2 },
  { size: "XXL", stock: 0 }, // Out of stock
]

export default function ExchangePage({ params }: { params: { id: string; itemId: string } }) {
  const router = useRouter()
  const { id: orderId, itemId } = params

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [reason, setReason] = useState<string>("wrong-size")
  const [description, setDescription] = useState("")
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  // Image upload state
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
 const {
    data: order,
    isLoading,
    error: fetchError,
  } = useQuery<any>({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: !!orderId,
  })

  const orderItem = order.items[0]
  const variants = DUMMY_VARIANTS

  // Available sizes from variants
  const availableSizes = variants.map((variant) => variant.size)
  const outOfStockSizes = variants.filter((variant) => variant.stock <= 0).map((v) => v.size)

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const newFiles = Array.from(e.target.files)

    // Check if adding these files would exceed the limit
    if (images.length + newFiles.length > 4) {
      toast({
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
    if (!selectedSize) {
      toast({
        title: "Size selection required",
        description: "Please select a new size for exchange.",
        variant: "destructive",
      })
      return
    }

    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please provide details about why you're exchanging this item.",
        variant: "destructive",
      })
      return
    }

    if (images.length === 0) {
      toast({
        title: "Images required",
        description: "Please upload at least one image of the item you want to exchange.",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success message
      setSuccess(true)
      toast({
        title: "Exchange request submitted",
        description: "Your exchange request has been submitted successfully.",
      })

      // Redirect after a delay
      setTimeout(() => {
        router.push(`/customer/returns/EXC${Math.floor(Math.random() * 10000)}`)
      }, 2000)
    } catch (err) {
      console.error("Error submitting exchange:", err)
      setError("Failed to submit exchange request. Please try again.")
      toast({
        title: "Submission failed",
        description: "There was an error submitting your exchange request. Please try again.",
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

  if (success) {
    return (
      <Alert variant="default" className="max-w-3xl mx-auto my-8 bg-green-50 border-green-200">
        <Check className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Exchange Request Submitted</AlertTitle>
        <AlertDescription className="text-green-700">
          Your exchange request has been submitted successfully. You will be redirected to the exchange details page.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Size Exchange Request</h1>
        <p className="text-muted-foreground">
          Order #{order.orderId} • {new Date(order.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Item Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Item to Exchange</CardTitle>
          <CardDescription>You are exchanging the following item for a different size.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4 p-4 bg-muted/20 rounded-lg">
            <div className="flex-shrink-0 w-16 h-16 relative">
              <Image
                src={orderItem.image || "/placeholder.svg?height=64&width=64&query=product"}
                alt={orderItem.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{orderItem.name}</h3>
              <div className="text-sm text-muted-foreground mt-1">
                <span className="mr-3">Current Size: {orderItem.size || "N/A"}</span>
                <span>Qty: {orderItem.qty}</span>
                <span className="ml-3">Price: {formatCurrency(orderItem.sale_price)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Size Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select New Size</CardTitle>
              <CardDescription>Choose the size you would like to exchange for.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="size">New Size</Label>
                <SizeSelector
                  sizes={availableSizes}
                  selectedSize={selectedSize}
                  onSelectSize={setSelectedSize}
                  currentSize={orderItem.size}
                  outOfStockSizes={outOfStockSizes}
                />
                {selectedSize && (
                  <p className="text-sm text-green-600 mt-2">You've selected size {selectedSize} for exchange.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Exchange</Label>
                <RadioGroup value={reason} onValueChange={setReason} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wrong-size" id="wrong-size" />
                    <Label htmlFor="wrong-size">Wrong Size - Too Small</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="too-large" id="too-large" />
                    <Label htmlFor="too-large">Wrong Size - Too Large</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other-reason" />
                    <Label htmlFor="other-reason">Other Reason</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Additional Details</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide more details about your exchange reason..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Upload Images */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
              <CardDescription>Upload up to 4 images of the item you're exchanging (required).</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square border rounded-md overflow-hidden">
                      <Image
                        src={url || "/placeholder.svg"}
                        alt={`Exchange image ${index + 1}`}
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
                  {images.length}/4 images uploaded. Please upload clear images of the item you want to exchange.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Exchange Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Exchange Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <p>By submitting this exchange request, you agree to the following:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>The item must be unworn, unwashed, and in its original condition with all tags attached.</li>
                  <li>You will ship the item back within 7 days of your exchange request being approved.</li>
                  <li>
                    Once we receive and verify the returned item, we will ship the new size to you as soon as possible.
                  </li>
                  <li>
                    If the requested size is out of stock by the time we process your return, we will contact you to
                    offer alternatives.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !selectedSize}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Exchange Request"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
