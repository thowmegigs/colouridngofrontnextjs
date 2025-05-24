"use client"

import { useState } from "react"
import { Plus, MapPin, Home, Briefcase, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Address {
  id: string
  type: "shipping" | "billing"
  label: string
  name: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  isDefault: boolean
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      type: "shipping",
      label: "Home",
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
      isDefault: true,
    },
    {
      id: "2",
      type: "billing",
      label: "Work",
      name: "John Doe",
      street: "456 Business Ave",
      city: "New York",
      state: "NY",
      zip: "10002",
      country: "United States",
      isDefault: true,
    },
    {
      id: "3",
      type: "shipping",
      label: "Parents",
      name: "John Doe",
      street: "789 Family Rd",
      city: "Boston",
      state: "MA",
      zip: "02108",
      country: "United States",
      isDefault: false,
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    type: "shipping",
    label: "",
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    isDefault: false,
  })

  const handleAddAddress = () => {
    if (
      newAddress.type &&
      newAddress.name &&
      newAddress.street &&
      newAddress.city &&
      newAddress.state &&
      newAddress.zip &&
      newAddress.country
    ) {
      const id = Math.random().toString(36).substring(2, 9)

      // If this is set as default, update other addresses of the same type
      if (newAddress.isDefault) {
        setAddresses(addresses.map((addr) => (addr.type === newAddress.type ? { ...addr, isDefault: false } : addr)))
      }

      setAddresses([...addresses, { ...(newAddress as Address), id }])
      setNewAddress({
        type: "shipping",
        label: "",
        name: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "United States",
        isDefault: false,
      })
      setIsAddDialogOpen(false)
    }
  }

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id))
  }

  const handleSetDefault = (id: string, type: "shipping" | "billing") => {
    setAddresses(addresses.map((addr) => (addr.type === type ? { ...addr, isDefault: addr.id === id } : addr)))
  }

  const getAddressIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case "home":
        return <Home className="h-4 w-4" />
      case "work":
        return <Briefcase className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  return (
    <div className="w-full max-w-full mx-auto">
      <div className="flex items-center justify-between mb-6 px-4 md:px-0">
        <h1 className="text-xl font-bold">My Addresses</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Address</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
              <DialogDescription>Enter the details for your new address.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address-type" className="text-right">
                  Type
                </Label>
                <Select
                  value={newAddress.type}
                  onValueChange={(value) => setNewAddress({ ...newAddress, type: value as "shipping" | "billing" })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address-label" className="text-right">
                  Label
                </Label>
                <Input
                  id="address-label"
                  placeholder="Home, Work, etc."
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address-name" className="text-right">
                  Full Name
                </Label>
                <Input
                  id="address-name"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address-street" className="text-right">
                  Street
                </Label>
                <Input
                  id="address-street"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address-city" className="text-right">
                  City
                </Label>
                <Input
                  id="address-city"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address-state" className="text-right">
                  State
                </Label>
                <Input
                  id="address-state"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address-zip" className="text-right">
                  ZIP
                </Label>
                <Input
                  id="address-zip"
                  value={newAddress.zip}
                  onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address-country" className="text-right">
                  Country
                </Label>
                <Select
                  value={newAddress.country}
                  onValueChange={(value) => setNewAddress({ ...newAddress, country: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address-default" className="text-right">
                  Default
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="address-default"
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="address-default" className="text-sm font-normal">
                    Set as default {newAddress.type} address
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAddress}>Add Address</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="px-4 md:px-0 pb-20 md:pb-0">
        <Tabs defaultValue="shipping" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="shipping" className="flex-1">
              Shipping
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex-1">
              Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shipping" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {addresses
                .filter((address) => address.type === "shipping")
                .map((address) => (
                  <Card key={address.id} className={`${address.isDefault ? "border-primary" : ""}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getAddressIcon(address.label)}
                          <CardTitle className="text-base">{address.label}</CardTitle>
                        </div>
                        {address.isDefault && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            Default
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{address.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-sm">
                        <p>{address.street}</p>
                        <p>
                          {address.city}, {address.state} {address.zip}
                        </p>
                        <p>{address.country}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                      {!address.isDefault && (
                        <Button variant="outline" size="sm" onClick={() => handleSetDefault(address.id, "shipping")}>
                          Set as Default
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}

              <Button
                variant="outline"
                className="w-full flex items-center justify-center py-6 border-dashed h-auto"
                onClick={() => {
                  setNewAddress({
                    ...newAddress,
                    type: "shipping",
                  })
                  setIsAddDialogOpen(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Shipping Address
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {addresses
                .filter((address) => address.type === "billing")
                .map((address) => (
                  <Card key={address.id} className={`${address.isDefault ? "border-primary" : ""}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getAddressIcon(address.label)}
                          <CardTitle className="text-base">{address.label}</CardTitle>
                        </div>
                        {address.isDefault && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            Default
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{address.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-sm">
                        <p>{address.street}</p>
                        <p>
                          {address.city}, {address.state} {address.zip}
                        </p>
                        <p>{address.country}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                      {!address.isDefault && (
                        <Button variant="outline" size="sm" onClick={() => handleSetDefault(address.id, "billing")}>
                          Set as Default
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}

              <Button
                variant="outline"
                className="w-full flex items-center justify-center py-6 border-dashed h-auto"
                onClick={() => {
                  setNewAddress({
                    ...newAddress,
                    type: "billing",
                  })
                  setIsAddDialogOpen(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Billing Address
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
