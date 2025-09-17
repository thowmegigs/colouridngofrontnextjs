'use client'
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What is ColourIndigo?",
    answer:
      "ColourIndigo is a multi-vendor fashion marketplace offering organic, sustainable, and stylish clothing for men, women, kids, and more. We connect conscious buyers with trusted sellers who believe in ethical fashion.",
  },
  {
    question: "Do you sell only clothing?",
    answer:
      "No, along with clothing for men, women, and kids, we also feature lingerie, accessories, and other lifestyle products from verified vendors.",
  },
  {
    question: "Are your products eco-friendly?",
    answer:
      "Yes! Many of our collections are made from eco-friendly fabrics, organic cotton, and materials free from harmful chemicals. We promote sustainable fashion that is kind to your skin and the planet.",
  },
  {
    question: "How can I place an order?",
    answer:
      "Browse our website, add products to your cart, and proceed to checkout. You can pay securely via multiple payment options including UPI, cards, net banking, and wallets.",
  },
  {
    question: "Do you offer Cash on Delivery (COD)?",
    answer:
      "Yes, COD is available on select products and locations. Availability will be shown at checkout.",
  },
  {
    question: "How much is the delivery charge?",
    answer:
      "Delivery charges may vary depending on the seller, product weight, and location. Some products come with Free Shipping while others may have a small fee displayed at checkout.",
  },
  {
    question: "How long will delivery take?",
    answer:
      "Delivery usually takes 4–7 business days depending on your location and seller. You will receive tracking details once your order is shipped.",
  },
  {
    question: "Can I return or exchange a product?",
    answer:
      "Yes, most products are eligible for returns and exchanges within 3 days of delivery (unless marked as non-returnable for hygiene/safety reasons like lingerie). Please check the product page for return eligibility.",
  },
  {
    question: "Who pays for return shipping?",
    answer:
      "If the product is defective, damaged, or not as described, the seller will cover return shipping. For other reasons (size issues, personal preference), the buyer may need to bear the return shipping cost.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once shipped, you will get an email/SMS with your tracking ID. You can also log in to your ColourIndigo account and check the status under My Orders.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Currently, we deliver across India. International shipping will be available soon.",
  },
  {
    question: "How can I become a seller on ColourIndigo?",
    answer:
      "If you are a brand or vendor, you can register with us by filling out the Vendor Registration Form on our website. After verification, you can list and sell your products.",
  },
  {
    question: "How do I contact ColourIndigo support?",
    answer:
      "You can reach us via Email: support@colourindigo.com | Phone/WhatsApp: +919991110716 | Contact Form: Available on our website under Help & Support",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">
        ColourIndigo – Frequently Asked Questions
      </h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border rounded-2xl shadow-sm overflow-hidden"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center p-4 text-left hover:bg-indigo-50 transition"
            >
              <span className="font-medium">{faq.question}</span>
              <ChevronDown
                className={`transform transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="p-4 pt-0 text-gray-700">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
