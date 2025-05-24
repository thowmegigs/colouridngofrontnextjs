"use client"

import { useState } from "react"
import { Plus, CreditCard, Trash2, Edit } from "lucide-react"
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

interface PaymentMethod {
  id: string
  type: "credit" | "debit" | "paypal"
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
  email?: string
  isDefault: boolean
}

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "credit",
      cardNumber: "•••• •••• •••• 4242",
      cardHolder: "John Doe",
      expiryDate: "12/25",
      isDefault: true,
    },
    {
      id: "2",
      type: "paypal",
      email: "john.doe@example.com",
      isDefault: false,
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPaymentMethod, setNewPaymentMethod] = useState<Partial<PaymentMethod>>({
    type: "credit",
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    email: "",
    isDefault: false,
  })

  const handleAddPaymentMethod = () => {
    if (
      (newPaymentMethod.type === "credit" || newPaymentMethod.type === "debit") &&
      newPaymentMethod.cardNumber &&
      newPaymentMethod.cardHolder &&
      newPaymentMethod.expiryDate
    ) {
      const id = Math.random().toString(36).substring(2, 9)

      // If this is set as default, update other payment methods
      if (newPaymentMethod.isDefault) {
        setPaymentMethods(paymentMethods.map((method) => ({ ...method, isDefault: false })))
      }

      setPaymentMethods([...paymentMethods, { ...(newPaymentMethod as PaymentMethod), id }])
      setNewPaymentMethod({
        type: "credit",
        cardNumber: "",
        cardHolder: "",
        expiryDate: "",
        email: "",
        isDefault: false,
      })
      setIsAddDialogOpen(false)
    } else if (newPaymentMethod.type === "paypal" && newPaymentMethod.email) {
      const id = Math.random().toString(36).substring(2, 9)

      // If this is set as default, update other payment methods
      if (newPaymentMethod.isDefault) {
        setPaymentMethods(paymentMethods.map((method) => ({ ...method, isDefault: false })))
      }

      setPaymentMethods([...paymentMethods, { ...(newPaymentMethod as PaymentMethod), id }])
      setNewPaymentMethod({
        type: "credit",
        cardNumber: "",
        cardHolder: "",
        expiryDate: "",
        email: "",
        isDefault: false,
      })
      setIsAddDialogOpen(false)
    }
  }

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id))
  }

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map((method) => ({ ...method, isDefault: method.id === id })))
  }

  return (
    <div className="mobile-app">
      <div className="mobile-header">
        <h1 className="text-xl font-bold">Payment Methods</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 w-8 p-0">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add Payment Method</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>Enter the details for your new payment method.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="payment-type" className="text-right">
                  Type
                </Label>
                <Select
                  value={newPaymentMethod.type}
                  onValueChange={(value) =>
                    setNewPaymentMethod({ ...newPaymentMethod, type: value as "credit" | "debit" | "paypal" })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="debit">Debit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(newPaymentMethod.type === "credit" || newPaymentMethod.type === "debit") && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="card-number" className="text-right">
                      Card Number
                    </Label>
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      value={newPaymentMethod.cardNumber}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cardNumber: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="card-holder" className="text-right">
                      Card Holder
                    </Label>
                    <Input
                      id="card-holder"
                      placeholder="John Doe"
                      value={newPaymentMethod.cardHolder}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cardHolder: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="expiry-date" className="text-right">
                      Expiry Date
                    </Label>
                    <Input
                      id="expiry-date"
                      placeholder="MM/YY"
                      value={newPaymentMethod.expiryDate}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, expiryDate: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </>
              )}

              {newPaymentMethod.type === "paypal" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="paypal-email" className="text-right">
                    PayPal Email
                  </Label>
                  <Input
                    id="paypal-email"
                    type="email"
                    placeholder="email@example.com"
                    value={newPaymentMethod.email}
                    onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="payment-default" className="text-right">
                  Default
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="payment-default"
                    checked={newPaymentMethod.isDefault}
                    onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, isDefault: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="payment-default" className="text-sm font-normal">
                    Set as default payment method
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPaymentMethod}>Add Payment Method</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mobile-content pb-20">
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <Card key={method.id} className={`${method.isDefault ? "border-primary" : ""}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <CardTitle className="text-base">
                      {method.type === "credit" ? "Credit Card" : method.type === "debit" ? "Debit Card" : "PayPal"}
                    </CardTitle>
                  </div>
                  {method.isDefault && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Default
                    </Badge>
                  )}
                </div>
                <CardDescription>{method.type === "paypal" ? method.email : method.cardHolder}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                {method.type !== "paypal" && (
                  <div className="text-sm">
                    <p className="font-medium">{method.cardNumber}</p>
                    <p className="text-gray-500">Expires {method.expiryDate}</p>
                  </div>
                )}
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
                    onClick={() => handleDeletePaymentMethod(method.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
                {!method.isDefault && (
                  <Button variant="outline" size="sm" onClick={() => handleSetDefault(method.id)}>
                    Set as Default
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}

          <Button
            variant="outline"
            className="w-full flex items-center justify-center py-6 border-dashed"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
      </div>
    </div>
  )
}
