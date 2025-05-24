"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export default function NotificationSettings() {
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    newOrders: true,
    productReviews: true,
    paymentReceipts: true,
    marketingEmails: false,
    stockAlerts: true,
    securityAlerts: true,
    appNotifications: true,
    smsNotifications: false,
    emailNotifications: true,
  })

  const handleToggle = (key: string) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Success",
        description: "Notification preferences updated successfully",
      })
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Manage how you receive notifications and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Order Notifications</h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="orderUpdates" className="flex-1">
                  Order status updates
                </Label>
                <Switch
                  id="orderUpdates"
                  checked={notifications.orderUpdates}
                  onCheckedChange={() => handleToggle("orderUpdates")}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="newOrders" className="flex-1">
                  New order notifications
                </Label>
                <Switch
                  id="newOrders"
                  checked={notifications.newOrders}
                  onCheckedChange={() => handleToggle("newOrders")}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="paymentReceipts" className="flex-1">
                  Payment receipts
                </Label>
                <Switch
                  id="paymentReceipts"
                  checked={notifications.paymentReceipts}
                  onCheckedChange={() => handleToggle("paymentReceipts")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Product Notifications</h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="productReviews" className="flex-1">
                  Product reviews
                </Label>
                <Switch
                  id="productReviews"
                  checked={notifications.productReviews}
                  onCheckedChange={() => handleToggle("productReviews")}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="stockAlerts" className="flex-1">
                  Low stock alerts
                </Label>
                <Switch
                  id="stockAlerts"
                  checked={notifications.stockAlerts}
                  onCheckedChange={() => handleToggle("stockAlerts")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">General Notifications</h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="securityAlerts" className="flex-1">
                  Security alerts
                </Label>
                <Switch
                  id="securityAlerts"
                  checked={notifications.securityAlerts}
                  onCheckedChange={() => handleToggle("securityAlerts")}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="marketingEmails" className="flex-1">
                  Marketing emails
                </Label>
                <Switch
                  id="marketingEmails"
                  checked={notifications.marketingEmails}
                  onCheckedChange={() => handleToggle("marketingEmails")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Delivery Methods</h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="appNotifications" className="flex-1">
                  In-app notifications
                </Label>
                <Switch
                  id="appNotifications"
                  checked={notifications.appNotifications}
                  onCheckedChange={() => handleToggle("appNotifications")}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications" className="flex-1">
                  Email notifications
                </Label>
                <Switch
                  id="emailNotifications"
                  checked={notifications.emailNotifications}
                  onCheckedChange={() => handleToggle("emailNotifications")}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="smsNotifications" className="flex-1">
                  SMS notifications
                </Label>
                <Switch
                  id="smsNotifications"
                  checked={notifications.smsNotifications}
                  onCheckedChange={() => handleToggle("smsNotifications")}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
