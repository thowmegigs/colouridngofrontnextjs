import { RotateCcw, Truck, CreditCard, FileText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReturnPolicy from "./components/return-policy"
import ReturnHistory from "./components/return-history"

export default function ReturnsPage() {
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
              Return eligible items within 30 days of delivery for a full refund.
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

        <Tabs defaultValue="process" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="process">Return Process</TabsTrigger>
            <TabsTrigger value="history">Return History</TabsTrigger>
            <TabsTrigger value="policy">Return Policy</TabsTrigger>
          </TabsList>

          <TabsContent value="process">
            <div className="border rounded-lg overflow-hidden">
              <div className="p-4 border-b bg-muted/30">
                <h2 className="font-medium">Return Process</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x">
                  <div className="p-6 text-center">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                      <span className="font-medium">1</span>
                    </div>
                    <h3 className="font-medium mb-2">Initiate Return</h3>
                    <p className="text-sm text-muted-foreground">Go to your order history and select "Return Item"</p>
                  </div>

                  <div className="p-6 text-center">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                      <span className="font-medium">2</span>
                    </div>
                    <h3 className="font-medium mb-2">Package Item</h3>
                    <p className="text-sm text-muted-foreground">Pack the item in its original packaging if possible</p>
                  </div>

                  <div className="p-6 text-center">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                      <span className="font-medium">3</span>
                    </div>
                    <h3 className="font-medium mb-2">Ship Return</h3>
                    <p className="text-sm text-muted-foreground">
                      Use the provided return label and drop off the package
                    </p>
                  </div>

                  <div className="p-6 text-center">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                      <span className="font-medium">4</span>
                    </div>
                    <h3 className="font-medium mb-2">Get Refund</h3>
                    <p className="text-sm text-muted-foreground">Receive your refund within 5-7 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <ReturnHistory />
          </TabsContent>

          <TabsContent value="policy">
            <ReturnPolicy />
          </TabsContent>
        </Tabs>

        <div className="border rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-muted/30 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            <h2 className="font-medium">Terms & Conditions</h2>
          </div>
          <div className="p-6">
            <div className="prose prose-sm max-w-none">
              <p>By initiating a return, you agree to the following terms and conditions:</p>

              <ol className="list-decimal pl-5 space-y-2">
                <li>All returns must be initiated within the eligible return period for your item category.</li>
                <li>
                  Items must be returned in their original condition, unused, unworn, and with all tags and packaging
                  intact.
                </li>
                <li>
                  For hygiene reasons, certain items like underwear, swimwear, and beauty products cannot be returned if
                  the seal is broken or the item has been used.
                </li>
                <li>
                  If you received a defective or damaged item, please contact customer service within 48 hours of
                  delivery.
                </li>
                <li>Refunds will be issued to the original payment method used for the purchase.</li>
                <li>
                  Shipping costs are non-refundable unless the return is due to our error (wrong item shipped, defective
                  product, etc.).
                </li>
                <li>
                  For items purchased during sales or with promotional discounts, the refund amount will be based on the
                  actual price paid.
                </li>
                <li>We reserve the right to refuse returns that do not meet our return policy requirements.</li>
              </ol>

              <p className="mt-4">
                For any questions or concerns regarding returns, please contact our customer service team at
                support@multivendor-marketplace.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
