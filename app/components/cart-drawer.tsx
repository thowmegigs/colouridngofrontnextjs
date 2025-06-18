"use client"
import { Button } from "@/components/ui/button"
import { image_base_url } from "@/contant"
import { Minus, Plus, RotateCcw, ShoppingBag, X } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "../lib/utils"
import { useCart } from "../providers/cart-provider"
import SafeImage from "./SafeImage"

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
              <ul className="space-y-4 ">
                {items.map((item) => (
                  <li key={item.variantId ?? item.id} className="gap-2 flex border  rounded-lg overflow-hidden">
                    <div className="w-[115px] h-24  ">
                      <SafeImage
                        fallbackSrc="/placeholder.png"
                        src={item.variantId
                          ? `${image_base_url}/storage/products/${item.id}/variants/thumbnail/large_${item.image}`
                          : `${image_base_url}/storage/products/${item.id}/thumbnail/large_${item.image}`
                        }
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-md m-1 ml-3 mt-4 w-full h-[165px] rounded-md object-fit"
                      />
                    </div>

                    <div className="flex-1 flex flex-col p-3">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium text-sm truncate max-w-[200px]">{item.name}</h4>

                          <p className="text-xs  mt-1">Sold by: <span className="font-extrabold">{item.vendorName}</span></p>
                          <p className="text-xs font-bold my-2">
                            {item.size && <span className="inline-flex items-center px-4 py-1 text-xs font-bold bg-gray-200 text-gray-800">Size: {item.size}</span>}
                            {item.size && item.color && " | "}
                            {item.color && <span className="inline-flex items-center px-4 py-1  text-xs font-bold bg-gray-200 text-gray-800">Color: {item.color}</span>}
                          </p>
                          <div className="text-right flex items-center gap-1 mb-2">
                            <div className="font-medium text-sm font-extrabold">{formatCurrency((item.sale_price ?? item.price)! * item.quantity)}</div>
                            {item.price && (
                              <div className="text-sm text-muted-foreground line-through">
                                {formatCurrency(item.price * item.quantity)}
                              </div>
                            )}
                            {item.discountMessage && (
                              <div className="text-xs text-red-600">

                                {item.discountMessage}
                              </div>
                            )}
                          </div>
                          {item.isReturnable &&
                            <div className="flex items-center space-x-2 my-2 text-sm  font-medium">
                              <RotateCcw className="w-4 h-4" />
                              <span><span className="font-extrabold">2 days</span> return available</span>
                            </div>
                          }
                        </div>

                        <button
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => removeItem(item.id, item.variantId)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </button>
                      </div>



                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center border rounded">
                          <button
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.variantId)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Decrease quantity</span>
                          </button>

                          <span className="w-8 h-8 flex items-center justify-center text-sm">{item.quantity}</span>

                          <button
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Increase quantity</span>
                          </button>
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

              <div className="grid grid-2 gap-2">
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
