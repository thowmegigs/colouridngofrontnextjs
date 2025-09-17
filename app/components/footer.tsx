import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const encodedMessage = encodeURIComponent("Hello");
  const chatLink = `https://wa.me/+919991110716?text=${encodedMessage}`;

  return (
    <footer className="bg-muted hidden md:block">
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href={chatLink}
          target="_blank"
          rel="noopener noreferrer"

        >
          <Image alt="wha" src="/whatsapp.png" width={40} height={40} />
        </a>
      </div>
      <div className="container py-12 hidden md:block">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 hidden sm:grid">


          <div>
            <h3 className="text-lg font-semibold mb-4">About Colourindigo</h3>
            <p className="text-muted-foreground mb-4">
              Colourindigo is a leading marketplace offering a wide range of products from trusted vendors across India.
            </p>
            <div className="flex ml-2  space-x-4">
              <Link href="https://www.facebook.com/people/Colour-indigo/61561099752863/" target="_blank">
                <Image
                  src="/images/facebook.png"
                  alt="Facebook"
                  width={24}
                  height={24}
                  className="mt-1  hover:opacity-80 transition"
                />
              </Link>
              <Link href="https://www.instagram.com/colour.indigo/?igsh=eTJpa2JvNGowNHp5#" target="_blank">
                <Image
                  src="/images/instagram.png"
                  alt="Instagram"
                  width={24}
                  height={24}
                  className="mt-1  hover:opacity-80 transition"
                />
              </Link>
              <Link href="https://www.youtube.com/@colourindigo?si=nlV7m0Kh3xIst7n3" target="_blank">
                <Image
                  src="/images/youtube.png"
                  alt="YouTube"
                  width={32}
                  height={60}
                  className="hover:opacity-80 transition"
                />
              </Link>



            </div>
            <div className=" my-4 flex ">
              <a
                href="https://play.google.com/store/apps/details?id=com.puraniya.colour_indigo" // replace with actual package
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/images/google_play.png"
                  alt="Get it on Google Play"
                  width={150}
                  height={40}
               
                />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/customer/help" className="text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/shipping_policy" className="text-muted-foreground hover:text-primary">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/return_policy" className="text-muted-foreground hover:text-primary">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy_policy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund_policy" className="text-muted-foreground hover:text-primary">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">My Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/customer/dashboard" className="text-muted-foreground hover:text-primary">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/customer/orders" className="text-muted-foreground hover:text-primary">
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-muted-foreground hover:text-primary">
                  Wishlist
                </Link>
              </li>

              <li>
                <Link href="https://vendor.colourindigo.com/login" className="text-muted-foreground hover:text-primary">
                  Seller Login
                </Link>
              </li>
              <li>
                <a href="https://vendor.colourindigo.com/register" className="text-muted-foreground hover:text-primary">
                  Become a Seller
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Haryana 127021</span>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">+919991110716</span>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">support@Colourindigo.com</span>
              </li>
            </ul>


          </div>
        </div>

        <div className="border-t mt-12 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Colourindigo Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
