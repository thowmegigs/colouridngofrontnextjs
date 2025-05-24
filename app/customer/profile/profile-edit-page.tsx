"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { Camera, Check, ChevronLeft, Loader2, Pencil, Trash2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"

// Mock user data
const userData = {
  id: "user123",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  bio: "I love shopping for the latest tech gadgets and fashion items.",
  avatar: "/vibrant-street-market.png",
  dateJoined: "2022-05-10",
  notifications: {
    email: true,
    sms: false,
    push: true,
  },
  addresses: [
    {
      id: "addr1",
      type: "Home",
      name: "John Doe",
      phone: "+1 (555) 123-4567",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
      isDefault: true,
    },
    {
      id: "addr2",
      type: "Work",
      name: "John Doe",
      phone: "+1 (555) 987-6543",
      street: "456 Market St",
      city: "New York",
      state: "NY",
      zip: "10002",
      country: "United States",
      isDefault: false,
    },
  ],
}

export default function ProfileEditPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [formData, setFormData] = useState(userData)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNotificationChange = (key: keyof typeof userData.notifications, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: checked,
      },
    }))
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeAvatarPreview = () => {
    setAvatarPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })

    setIsLoading(false)
  }

  return (
    <div className="w-full max-w-full mx-auto pb-20 md:pb-10">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white sticky top-0 z-10 border-b">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Edit Profile</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSubmit}
          disabled={isLoading}
          className="text-pink-600 font-medium"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
          Save
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 px-4 md:px-0 pt-4 md:pt-0">
        {/* Profile Avatar Section */}
        <div className="flex flex-col items-center justify-center py-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
          <div className="relative group">
            <Avatar
              className="h-24 w-24 border-4 border-white cursor-pointer group-hover:opacity-80 transition-opacity"
              onClick={handleAvatarClick}
            >
              <AvatarImage src={avatarPreview || formData.avatar} alt={`${formData.firstName} ${formData.lastName}`} />
              <AvatarFallback className="text-2xl">
                {formData.firstName.charAt(0)}
                {formData.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div
              className="absolute bottom-0 right-0 bg-pink-600 text-white p-1.5 rounded-full cursor-pointer shadow-md"
              onClick={handleAvatarClick}
            >
              <Camera className="h-4 w-4" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              aria-label="Upload profile picture"
            />
          </div>

          {avatarPreview && (
            <div className="mt-4 flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={removeAvatarPreview}
                className="text-xs flex items-center"
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
              <Button type="button" size="sm" className="text-xs flex items-center">
                <Check className="h-3 w-3 mr-1" />
                Apply
              </Button>
            </div>
          )}

          <h2 className="mt-4 text-lg font-semibold">
            {formData.firstName} {formData.lastName}
          </h2>
          <p className="text-sm text-muted-foreground">Member since {new Date(formData.dateJoined).getFullYear()}</p>
        </div>

        {/* Tabs for different sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-lg font-medium">Personal Information</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Your Addresses</h3>
              <Button variant="outline" size="sm" className="flex items-center">
                <Pencil className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </div>

            {formData.addresses.map((address) => (
              <Card key={address.id} className={cn(address.isDefault && "border-pink-200")}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <span
                        className={cn(
                          "text-xs font-medium mr-2 px-2.5 py-0.5 rounded",
                          address.isDefault ? "bg-pink-100 text-pink-800" : "bg-gray-100 text-gray-800",
                        )}
                      >
                        {address.type}
                      </span>
                      {address.isDefault && <span className="text-xs text-gray-500">Default</span>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{address.name}</p>
                    <p>{address.street}</p>
                    <p>
                      {address.city}, {address.state} {address.zip}
                    </p>
                    <p>{address.country}</p>
                    <p className="text-gray-500 mt-2">{address.phone}</p>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  {!address.isDefault && (
                    <Button variant="outline" size="sm" className="w-full text-sm">
                      Set as Default
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-lg font-medium">Notification Preferences</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive order updates via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={formData.notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive order updates via SMS</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={formData.notifications.sms}
                    onCheckedChange={(checked) => handleNotificationChange("sms", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={formData.notifications.push}
                    onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-lg font-medium">Privacy Settings</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-collection">Data Collection</Label>
                    <p className="text-sm text-muted-foreground">Allow us to collect usage data</p>
                  </div>
                  <Switch id="data-collection" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive marketing emails</p>
                  </div>
                  <Switch id="marketing-emails" defaultChecked={false} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Desktop Save Button */}
        <div className="hidden md:flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>

        {/* Mobile Fixed Bottom Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-50">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
