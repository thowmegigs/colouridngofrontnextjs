export default function ReturnPolicy() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-muted/30">
        <h2 className="font-medium">Return Policy</h2>
      </div>
      <div className="p-6">
        <div className="prose prose-sm max-w-none">
          <p>
            Most items purchased from MultiVendor Marketplace can be returned within 30 days of delivery. However,
            certain products have different return policies:
          </p>

          <h3 className="text-lg font-medium mt-6 mb-3">Return Eligibility by Category</h3>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Electronics</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Must be returned within 15 days of delivery</li>
                <li>Must be in original packaging with all accessories</li>
                <li>Must not show signs of use or damage</li>
                <li>Software, games, and digital products cannot be returned once opened or used</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Clothing & Accessories</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Must be returned within 30 days of delivery</li>
                <li>Must have original tags attached</li>
                <li>Must not be worn, washed, or altered</li>
                <li>Underwear, swimwear, and intimate apparel cannot be returned for hygiene reasons</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Home & Kitchen</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Must be returned within 30 days of delivery</li>
                <li>Must be in original packaging</li>
                <li>Must not show signs of use or damage</li>
                <li>Large appliances must be returned within 10 days</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Beauty & Personal Care</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Must be returned within 15 days of delivery</li>
                <li>Must be unopened and sealed</li>
                <li>Cannot be returned if seal is broken or product is used</li>
                <li>Defective items can be returned within 7 days</li>
              </ul>
            </div>
          </div>

          <h3 className="text-lg font-medium mt-6 mb-3">Non-Returnable Items</h3>
          <p>The following items cannot be returned:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Customized or personalized products</li>
            <li>Perishable goods (food, flowers, etc.)</li>
            <li>Downloadable software products</li>
            <li>Gift cards and vouchers</li>
            <li>Intimate items (for hygiene reasons)</li>
            <li>Items marked as non-returnable on the product page</li>
          </ul>

          <h3 className="text-lg font-medium mt-6 mb-3">Refund Process</h3>
          <p>
            Once your return is received and inspected, we will send you an email to notify you that we have received
            your returned item. We will also notify you of the approval or rejection of your refund.
          </p>
          <p>
            If approved, your refund will be processed, and a credit will automatically be applied to your original
            method of payment within 5-7 business days. Depending on your credit card company, it may take an additional
            2-10 business days for the refund to appear on your statement.
          </p>

          <h3 className="text-lg font-medium mt-6 mb-3">Return Shipping</h3>
          <p>
            For most items, we provide a prepaid return shipping label. If the return is due to our error (you received
            an incorrect or defective item), we will cover the return shipping cost. If the return is due to customer
            preference, the shipping cost may be deducted from your refund.
          </p>

          <h3 className="text-lg font-medium mt-6 mb-3">Exchanges</h3>
          <p>
            We do not process exchanges directly. If you need a different size, color, or item, please return the
            original purchase and place a new order for the desired item.
          </p>

          <p className="mt-6 text-sm text-muted-foreground">
            This return policy was last updated on April 16, 2023. We reserve the right to modify this policy at any
            time.
          </p>
        </div>
      </div>
    </div>
  )
}
