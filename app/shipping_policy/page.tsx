// app/shipping-policy/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shipping Policy - YourSiteName",
    description: "Learn about our shipping times, methods, and other related information.",
};

export default function ShippingPolicyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 font-sans text-gray-700">
            {/* Header */}
            <header className="mb-8 text-center">
                <h1 className="text-xl md:text-3xl font-bold text-indigo-700 mb-4">
                    SHIPPING POLICY
                </h1>
                <div className="h-1 w-24 bg-indigo-600 mx-auto mb-6"></div>
            </header>

            {/* Main Content */}
            <div className="prose prose-indigo max-w-none">
                {/* Introduction */}


                {/* Section 1: User Account */}
                <Section title="Processing Time">
                    <p className="mb-4">
                        All orders are delivered within 3-7 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant delay in the shipment of your order,
                        we will contact you via email or phone.

                    </p>

                </Section>
                <Section title="Shipping Time Domestic Shipping">
                    <p className="mb-4">
                        Orders will be delivered within 3-7 business days from the date of order confirmation. Please note that delivery times may be affected by factors beyond our control, such as weather conditions, customs delays, and other unforeseen circumstances


                    </p>

                </Section>


            </div>
        </div>
    );
};

// Reusable Section Component
const Section = ({ title, children }) => (
    <section className="mb-10">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4 pb-2 border-b border-indigo-200">
            {title}
        </h2>
        {children}
    </section>
);

// Reusable SubSection Component
const SubSection = ({ title, children }) => (
    <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        {children}
    </div>
);

