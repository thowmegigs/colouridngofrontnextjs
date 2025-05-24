"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function StoreSettings() {
  const [formData, setFormData] = useState({
    storeName: "John's Electronics",
    storeDescription: "We sell high-quality electronics and accessories at competitive prices.",
    storeEmail: "contact@johnselectronics.com",
    storePhone: "+1 (555) 987-6543",
    storeAddress: "123 Main St, New York, NY 10001",
    storeWebsite: "https://johnselectronics.com",
  })
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit the form data to your backend
    alert("Store settings updated successfully!")
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Information</CardTitle>
        <CardDescription>
          Update your store details and contact information
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="storeDescription">Store Description</Label>
            <Textarea
              id="storeDescription"
              name="storeDescription"
              value={formData.storeDescription}
              onChange={handleChange}
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storeEmail">Store Email</Label>
              <Input
                id="storeEmail"
                name="storeEmail"
                type="email"
                value={formData.storeEmail}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storePhone">Store Phone</Label>
              <Input
                id="storePhone"
                name="storePhone"
                value={formData.storePhone}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="st\
\
