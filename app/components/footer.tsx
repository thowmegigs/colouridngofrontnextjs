import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-muted">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About MultiVendor</h3>
            <p className="text-muted-foreground mb-4">
              MultiVendor is a leading marketplace offering a wide range of products from trusted vendors around the
              world.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-primary">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-primary">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">My Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/account" className="text-muted-foreground hover:text-primary">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="text-muted-foreground hover:text-primary">
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-muted-foreground hover:text-primary">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/account/addresses" className="text-muted-foreground hover:text-primary">
                  Addresses
                </Link>
              </li>
              <li>
                <Link href="/account/payment-methods" className="text-muted-foreground hover:text-primary">
                  Payment Methods
                </Link>
              </li>
              <li>
                <Link href="/vendor/register" className="text-muted-foreground hover:text-primary">
                  Become a Vendor
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">123 Commerce Street, Shopping District, 10001</span>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">support@multivendor.com</span>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="font-medium mb-2">Subscribe to our newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 rounded-l-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button className="rounded-l-none">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MultiVendor Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
