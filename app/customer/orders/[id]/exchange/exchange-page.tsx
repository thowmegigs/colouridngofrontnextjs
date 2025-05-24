"use client"

import type React from "react"

import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { use, useEffect, useRef, useState } from "react"

import { ColorSelector } from "@/app/components/color-selector"
import { SizeSelector } from "@/app/components/size-selector"
import { formatCurrency } from "@/app/lib/utils"
import { useToast } from "@/app/providers/ToastProvider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { api_url } from "@/contant"
import { fetchProductVariantById } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Check, Loader2 } from "lucide-react"


export default function ExchangePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const searchParams = useSearchParams();
  const itemId = searchParams.get("itemId");
  const { id: orderId } = use(params);

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { showToast: toast } = useToast()
  // Form state
  const [reason, setReason] = useState<string>("style-preference")
  const [description, setDescription] = useState("")
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<any>(null)
  const [selectedVariantQuantity, setSelectedVariantQuantity] = useState(10000);
  const [selectedVariantId, setSelectedVariantId] = useState<any>(null);
  // Image upload state
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [outOfStockSizes, setOutOfStockSizes] = useState<any>([]);
  const [outOfStockColors, setOutOfStockColors] = useState<any>([]);
  const {
    data: variant_detail,
    isLoading,
    error: fetchError,
  } = useQuery<any>({
    queryKey: ["product_variant", itemId],
    queryFn: () => fetchProductVariantById(itemId),
    enabled: !!orderId,
  })
  useEffect(() => {
    
    if (!isLoading) {
   
     

      const foundVariant = variant_detail.variants.find((variant: any) => {
        const parts = variant.name.split('-').map((p: any) => p.trim().toLowerCase());
        let selSize:any=selectedSize
        let selColor:any=selectedColor
       if(!selSize){
          if(variant_detail.orderItem.atributes_json.Size)
             selSize=variant_detail.orderItem.atributes_json.Size
           
       }
       if(!selColor){
          if(variant_detail.orderItem.atributes_json.Color)
             selColor=variant_detail.orderItem.atributes_json.Color
       
       }
       if(selSize && selColor)
        return (
          parts.includes(selSize.toLowerCase()) &&
          parts.includes(selColor.toLowerCase())
        );
       else if(selSize && !selColor)
        return (
          parts.includes(selSize.toLowerCase())
        );
       if(selColor && !selSize)
        return parts.includes(selColor.toLowerCase()
        );
      });

      if (foundVariant) {
        setSelectedVariantQuantity(foundVariant.quantity);
        
        setSelectedVariantId(foundVariant.id);
      } else {
        setSelectedVariantQuantity(0); // or 0 if you prefer
      }
    }
  }, [selectedSize, selectedColor, variant_detail, isLoading]);
  useEffect(() => {
    if (isLoading || !variant_detail) return;

    const sizesSet = new Set();
    const colorsSet = new Set();

    variant_detail.variants.forEach((variant: any) => {
      if (variant.quantity === 0) {
        const size = variant.atributes_json?.Size;
        const color = variant.atributes_json?.Color;
        if (size) sizesSet.add(size);
        if (color) colorsSet.add(color);
      }

    });

    setOutOfStockSizes([...sizesSet]);
    setOutOfStockColors([...colorsSet]);
  //   const initialSize = variant_detail.orderItem.atributes_json?.Size
  //   setSelectedSize(initialSize)
  //   const initialColor = variant_detail.orderItem.atributes_json?.Color
  //   const cc = variant_detail.attributes.Color
  //   const g=cc.find((v: any) => v.name === initialColor)
  //   console.log(cc.find((v: any) => v.name === initialColor))
  //  setSelectedColor({...g})
  }
    , [variant_detail, isLoading]);



  // Available sizes from variants

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const newFiles = Array.from(e.target.files)


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
    const isSizeChanged = selectedSize !== null && selectedSize !== variant_detail.orderItem.atributes_json.Size
    const isColorChanged = selectedColor !== null && selectedColor.name !== variant_detail.orderItem.atributes_json.Color

    if (!isSizeChanged && !isColorChanged) {
      toast("Selection required", "Please select a different size or color (or both) for exchange.",
      )
      return
    }

    if (!description.trim()) {
      toast("Description required", "Please provide details about why you're exchanging this item.",
      )
      return
    }

   

    try {
      setSubmitting(true)
      setError(null)

      const post={
        description,reason,variant_to_exchange:selectedVariantId,itemId,orderId
      }
     const response=await axios.post(`${api_url}/exchanges/`,post,{
       withCredentials: true 
     })
   
      toast("Exchange request submitted", "Your exchange request has been submitted successfully.",
      )

      // Redirect after a delay
      setTimeout(() => {
        router.push(`/customer/exchanges/${response.data.data.returnId}`)
      }, 2000)
    } catch (err) {
      console.error("Error submitting exchange:", err)
      setError("Failed to submit exchange request. Please try again.")
      toast("Submission failed", "There was an error submitting your exchange request. Please try again.",
      )
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
  if (isLoading) {
    return <h1>loading</h1>
  }
  if (fetchError) {
    return <h1>error in loading variant</h1>
  }
  const availableSizes = variant_detail.attributes.Size;
  const availableColors = variant_detail.attributes.Color;
  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Product Exchange Request</h1>
        <p className="text-muted-foreground">
          Order #{orderId}
        </p>
      </div>

      {/* Item Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Item to Exchange</CardTitle>
          <CardDescription>You are exchanging the following item.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4 p-4 bg-muted/20 rounded-lg">
            <div className="flex-shrink-0 w-16 h-16 relative">
              <Image
                src={variant_detail.orderItem.image || "/placeholder.svg?height=64&width=64&query=product"}
                alt={variant_detail.orderItem.name}
                fill
                className="object-cover rounded-md"
              />
            </div>

            <div className="flex-1">
              <h3 className="font-medium">{variant_detail.orderItem?.name}</h3>
              {variant_detail.orderItem?.atributes_json && (
                <div className="text-sm text-muted-foreground mt-1">
                  {variant_detail.orderItem?.atributes_json.Size &&
                    <span className="mr-3">Size: {variant_detail.orderItem?.atributes_json.Size || "N/A"}</span>
                  }
                  {variant_detail.orderItem?.atributes_json.Color &&
                    <div className="inline-flex items-center gap-1 mr-3">
                      <span>Color: {variant_detail.orderItem?.atributes_json.Color || "N/A"}</span>
                      <div
                        className="inline-block w-3 h-3 rounded-full border"
                        style={{ backgroundColor: variant_detail.attributes.Color.find((v: any) => v.name === variant_detail.orderItem?.atributes_json.Color).code || "#ccc" }}
                      />
                    </div>
                  }
                  <span>Qty: {variant_detail.orderItem.qty}</span>
                  <span className="ml-3">Price: {formatCurrency(variant_detail.orderItem.sale_price)}</span>
                </div>)
              }

            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Exchange Options</CardTitle>
              <CardDescription>Select the size and/or color you would like to exchange for.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {
                variant_detail.attributes.Size &&
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="size" className="text-lg font-medium">
                      Size
                    </Label>
                    <div className="text-sm text-muted-foreground">Current: {variant_detail.orderItem.atributes_json.Size}</div>
                  </div>
                  <SizeSelector
                    sizes={availableSizes}
                    selectedSize={selectedSize}
                    onSelectSize={setSelectedSize}
                    currentSize={variant_detail.orderItem.atributes_json.Size}
                    outOfStockSizes={outOfStockSizes}
                  />
                  {selectedSize && (
                    <p className="text-sm text-green-600">You've selected size {selectedSize} for exchange.</p>
                  )}
                </div>
              }


              {
                variant_detail.attributes.Color &&
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="color" className="text-lg font-medium">
                      Color
                    </Label>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <span>Current: Yellow</span>
                      <div
                        className="inline-block w-3 h-3 rounded-full border"
                        style={{ backgroundColor: variant_detail.attributes.Color.find((v: any) => v.name == variant_detail.orderItem.atributes_json.Color).code || "#ccc" }}
                      />
                    </div>
                  </div>
                  <ColorSelector
                    colors={availableColors}
                    selectedColor={selectedColor}
                    onSelectColor={setSelectedColor}
                    currentColor={variant_detail.orderItem.atributes_json.Color}
                    outOfStockColors={outOfStockColors}
                  />
                  {selectedColor && (
                    <p className="text-sm text-green-600">You've selected {selectedColor.name} color for exchange.</p>
                  )}
                </div>
              }

              <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                <p className="text-amber-800 text-sm">
                  Please select at least one option (size or color) that is different from your current item.
                </p>
              
           
               </div>
            </CardContent>
          </Card>

          {/* Exchange Details */}
          <Card>
            <CardHeader>
              <CardTitle>Exchange Details</CardTitle>
              <CardDescription>Tell us why you're exchanging this item.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Exchange</Label>
                <RadioGroup value={reason} onValueChange={setReason} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wrong-size" id="wrong-size" />
                    <Label htmlFor="wrong-size">Wrong Size</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wrong-color" id="wrong-color" />
                    <Label htmlFor="wrong-color">Wrong Color</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="style-preference" id="style-preference" />
                    <Label htmlFor="style-preference">Style Preference</Label>
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
                    Once we receive and verify the returned item, we will ship the new item to you as soon as possible.
                  </li>
                  <li>
                    If the requested variant is out of stock by the time we process your return, we will contact you to
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
            <Button
              type="submit"
              disabled={
                submitting ||
                ((selectedSize === null || selectedSize === variant_detail.orderItem.atributes_json.Size) &&
                  (selectedColor === null || selectedColor.name === variant_detail.orderItem.atributes_json.Color)) ||
                !description.trim() 
              }
            >
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
