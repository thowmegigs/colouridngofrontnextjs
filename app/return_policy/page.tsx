'use client';
import { fetchSetting } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, FileText, RotateCcw, Truck } from "lucide-react";


export default function ReturnsPage() {
   const { data: setting } = useQuery<any>({
    queryKey: ["setting"],
    queryFn: () => fetchSetting(),
  
  })
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Returns & Replacements</h1>
          <p className="text-muted-foreground text-lg">
            We want you to be completely satisfied with your purchase. If you're not, we're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="border rounded-lg p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Easy Returns</h3>
            <p className="text-sm text-muted-foreground">
              Return eligible items within {setting?.return_days??3} days of delivery for a full refund.
            </p>
          </div>

          <div className="border rounded-lg p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Free Return Shipping</h3>
            <p className="text-sm text-muted-foreground">We provide free return shipping labels for eligible items.</p>
          </div>

          <div className="border rounded-lg p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Quick Refunds</h3>
            <p className="text-sm text-muted-foreground">
              Refunds are processed within 5-7 business days after we receive your return.
            </p>
          </div>
        </div>

     

        <div className="border rounded-lg overflow-hidden">
  <div className="p-4 border-b bg-muted/30 flex items-center">
    <FileText className="h-5 w-5 mr-2" />
    <h2 className="font-medium">Terms & Conditions</h2>
  </div>
  <div className="p-6">
    <div className="prose prose-sm max-w-none">
      <p>
        By initiating a return, you agree to the following terms and conditions:
      </p>

      <ul className="list-disc pl-6 space-y-2 text-gray-700 text-base">
        <li>
          We have a <span className="font-medium">{setting?.return_days??3}-day return policy</span>, which means you have {setting?.return_days??3} days after receiving your item to request a return.
        </li>
        <li>
          Once the returned product is received, it will be inspected and the return will be approved within {setting?.return_days??3} days.
        </li>
        <li>
          We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not.
        </li>
        <li>
          If approved, you’ll be automatically refunded on your original payment method within <span className="font-medium">10 business days</span> with all deductions.
        </li>
        <li>
          Please remember it can take some time for your bank or credit card company to process and post the refund too.
        </li>
        <li>
          If more than <span className="font-medium">15 business days</span> have passed since we’ve approved your return, please contact us.
        </li>
      </ul>

      <p className="mt-4">
        For any questions or concerns regarding returns, please contact our customer service team at
        <a href="mailto:support@colourindigo.com" className="text-indigo-600 underline ml-1">
          support@colourindigo.com
        </a>.
      </p>
    </div>
  </div>
</div>

      </div>
    </div>
  )
}
