"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export default function BankDetails() {
  const [loading, setLoading] = useState(false)
  const [bankDetails, setBankDetails] = useState({
    accountName: "John Doe",
    accountNumber: "XXXX-XXXX-XXXX-1234",
    bankName: "National Bank",
    branchCode: "BR-001",
    swiftCode: "NATBANKXXX",
    accountType: "savings",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBankDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setBankDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Success",
        description: "Bank details updated successfully",
      })
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Account Details</CardTitle>
        <CardDescription>Update your bank account information for receiving payments</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="accountName">Account Holder Name</Label>
              <Input
                id="accountName"
                name="accountName"
                value={bankDetails.accountName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                value={bankDetails.accountNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input id="bankName" name="bankName" value={bankDetails.bankName} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="branchCode">Branch Code</Label>
              <Input
                id="branchCode"
                name="branchCode"
                value={bankDetails.branchCode}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="swiftCode">SWIFT/BIC Code</Label>
              <Input id="swiftCode" name="swiftCode" value={bankDetails.swiftCode} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountType">Account Type</Label>
              <Select
                value={bankDetails.accountType}
                onValueChange={(value) => handleSelectChange("accountType", value)}
              >
                <SelectTrigger id="accountType">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
