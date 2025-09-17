'use client';

import { fetchSetting } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const RefundPolicy = () => {
   const { data: setting } = useQuery<any>({
    queryKey: ["setting"],
    queryFn: () => fetchSetting(),
  
  })
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans text-gray-700">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-xl md:text-3xl font-bold text-indigo-700 mb-4">
          Return and Refund policy
        </h1>
        <div className="h-1 w-24 bg-indigo-600 mx-auto mb-6"></div>
      </header>

      {/* Main Content */}
      <div className="prose prose-indigo max-w-none">
        {/* Introduction */}


        {/* Section 1: User Account */}
        <section title="Return Methods">

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




        </section>



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

export default RefundPolicy