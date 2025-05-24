"use client"
import { Button } from "@/components/ui/button"
import { AlertCircle, Minus, Plus, ShoppingBag, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatCurrency } from "../lib/utils"
import { useCart } from "../providers/cart-provider"

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, isOpen, setIsOpen, subtotal, discount, total } = useCart()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-background shadow-xl flex flex-col animate-in slide-in-from-right">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Your Cart
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close cart</span>
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg mb-1">Your cart is empty</h3>
            <p className="text-muted-foreground mb-4">Looks like you haven't added anything to your cart yet.</p>
            <Button onClick={() => setIsOpen(false)}>Continue Shopping</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto p-4">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="flex border rounded-lg overflow-hidden">
                    <div className="w-24 h-24 flex-shrink-0 bg-muted">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col p-3">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && " | "}
                            {item.color && `Color: ${item.color}`}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">Sold by: {item.vendorName}</p>
                        </div>

                        <button
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </button>
                      </div>

                      {item.discountMessage && (
                        <div className="mt-1 text-xs text-green-600 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {item.discountMessage}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center border rounded">
                          <button
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Decrease quantity</span>
                          </button>

                          <span className="w-8 h-8 flex items-center justify-center text-sm">{item.quantity}</span>

                          <button
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Increase quantity</span>
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(item.sale_price! * item.quantity)}</div>
                          {item.price && (
                            <div className="text-xs text-muted-foreground line-through">
                              {formatCurrency(item.price * item.quantity)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Link href="/cart" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    View Cart
                  </Button>
                </Link>

                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Checkout</Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
