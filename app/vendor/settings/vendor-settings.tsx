"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileSettings from "./components/profile-settings"
import StoreSettings from "./components/store-settings"
import BankDetails from "./components/bank-details"
import NotificationSettings from "./components/notification-settings"

export default function VendorSettings() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="bank">Bank Details</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="store">
          <StoreSettings />
        </TabsContent>

        <TabsContent value="bank">
          <BankDetails />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
