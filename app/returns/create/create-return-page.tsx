"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ChevronRight, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { formatCurrency } from "@/app/lib/utils"
import { Input } from "@/components/ui/input"

// Mock order data for the current return
const currentOrder = {
  id: "ORD123456",
  date: "2023-05-15",
  items: [
    {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      price: 79.99,
      quantity: 1,
      image: "/placeholder.svg?height=80&width=80",
      returnable: true,
    },
    {
      id: "2",
      name: "Smart Fitness Tracker",
      price: 49.99,
      quantity: 1,
      image: "/placeholder.svg?height=80&width=80",
      returnable: true,
    },
  ],
}

const returnReasons = [
  "Item doesn't match description",
  "Item doesn't fit",
  "Item arrived damaged",
  "Received wrong item",
  "Item has missing parts",
  "Item doesn't meet expectations",
  "Changed my mind",
  "Found a better price elsewhere",
  "Other",
]

export default function CreateReturnPage({ orderId }: { orderId?: string }) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [returnReason, setReturnReason] = useState("")
  const [returnMethod, setReturnMethod] = useState("refund")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleItemToggle = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId))
    } else {
      setSelectedItems([...selectedItems, itemId])
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true)

      // Simulate upload delay
      setTimeout(() => {
        const newImages = Array.from(e.target.files || []).map((file) => URL.createObjectURL(file))
        setUploadedImages([...uploadedImages, ...newImages])
        setIsUploading(false)
      }, 1500)
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages]
    newImages.splice(index, 1)
    setUploadedImages(newImages)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit the return request to your backend
    alert("Return request submitted successfully!")
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-8">
        <Link href="/returns" className="text-muted-foreground hover:text-foreground flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Returns
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
        <span>Create Return Request</span>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Create Return Request</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="border rounded-lg overflow-hidden">
            <div className="p-4 border-b bg-muted/30">
              <h2 className="font-medium">1. Select Items to Return</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {currentOrder.items.map((item) => (
                  <div key={item.id} className="flex items-start">
                    <Checkbox
                      id={`item-${item.id}`}
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleItemToggle(item.id)}
                      disabled={!item.returnable}
                      className="mt-1"
                    />
                    <div className="ml-3 flex flex-1">
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-muted">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <Label htmlFor={`item-${item.id}`} className={!item.returnable ? "text-muted-foreground" : ""}>
                          {item.name}
                        </Label>
                        <div className="flex justify-between mt-1">
                          <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                          <span className="font-medium">{formatCurrency(item.price)}</span>
                        </div>
                        {!item.returnable && (
                          <p className="text-sm text-destructive mt-1">This item is not eligible for return</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedItems.length === 0 && (
                <p className="text-sm text-muted-foreground mt-4">Please select at least one item to return</p>
              )}
            </div>
          </div>

          {selectedItems.length > 0 && (
            <>
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h2 className="font-medium">2. Return Details</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <Label htmlFor="return-reason">Reason for Return</Label>
                    <Select value={returnReason} onValueChange={setReturnReason}>
                      <SelectTrigger id="return-reason" className="mt-2">
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                      <SelectContent>
                        {returnReasons.map((reason) => (
                          <SelectItem key={reason} value={reason}>
                            {reason}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="additional-info">Additional Information (Optional)</Label>
                    <Textarea
                      id="additional-info"
                      placeholder="Please provide any additional details about your return"
                      className="mt-2"
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block">Upload Images of Defects</Label>
                    <div className="border-2 border-dashed rounded-md p-6 text-center">
                      <Input
                        id="defect-images"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Label htmlFor="defect-images" className="cursor-pointer block">
                        <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Click to upload images</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Upload clear images showing any defects or damage
                        </p>
                      </Label>
                    </div>

                    {isUploading && (
                      <div className="mt-4 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="ml-2 text-sm">Uploading images...</span>
                      </div>
                    )}

                    {uploadedImages.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Uploaded Images ({uploadedImages.length})</p>
                        <div className="grid grid-cols-3 gap-3">
                          {uploadedImages.map((image, index) => (
                            <div key={index} className="relative rounded-md overflow-hidden border">
                              <Image
                                src={image || "/placeholder.svg"}
                                alt={`Uploaded image ${index + 1}`}
                                width={100}
                                height={100}
                                className="w-full h-24 object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-black/70 rounded-full p-1"
                              >
                                <X className="h-4 w-4 text-white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Return Method</Label>
                    <RadioGroup value={returnMethod} onValueChange={setReturnMethod} className="mt-2 space-y-3">
                      <div className="flex items-start">
                        <RadioGroupItem value="refund" id="refund" className="mt-1" />
                        <div className="ml-3">
                          <Label htmlFor="refund" className="font-medium">
                            Refund to Original Payment Method
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Get your money back to the original payment method used for the purchase
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <RadioGroupItem value="exchange" id="exchange" className="mt-1" />
                        <div className="ml-3">
                          <Label htmlFor="exchange" className="font-medium">
                            Store Credit
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive store credit that can be used for future purchases
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h2 className="font-medium">3. Terms & Conditions</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-start">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                      className="mt-1"
                    />
                    <div className="ml-3">
                      <Label htmlFor="terms">I agree to the return policy and terms & conditions</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        By submitting this return request, I confirm that all items are in their original condition,
                        unused, and with all tags and packaging intact. I understand that the final refund amount may be
                        adjusted based on the condition of the returned items.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={selectedItems.length === 0 || !returnReason || !agreeToTerms}>
                  Submit Return Request
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
