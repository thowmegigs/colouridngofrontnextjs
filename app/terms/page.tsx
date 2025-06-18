import React from 'react';

const TermsOfUse = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans text-gray-700">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-4">
          TERMS OF USE
        </h1>
        <div className="h-1 w-24 bg-indigo-600 mx-auto mb-6"></div>
      </header>

      {/* Main Content */}
      <div className="prose prose-indigo max-w-none">
        {/* Introduction */}
        <section className="mb-8">
          <p className="mb-4">
            Welcome to colour indigo. This document is an electronic record in terms of Information Technology Act, 2000 and published in accordance with the provisions of Rule 3 ) of the Information Technology (Intermediaries guidelines) Rules, 2011 that require publishing the rules and regulations, privacy policy and Terms of Use for access or usage of colour indigo marketplace platform - www.colourindigo.com (hereinafter referred to as "Platform").
          </p>
          <p className="mb-4">
            The Platform is owned by colour indigo Designs, having its registered office at Street 7 Dadari gate Bhiwani Haryana 127021, India and its Bitna Road Pinjore district Panchkula Haryana, India.
          </p>
        </section>

        {/* Section 1: User Account */}
        <Section title="1. User Account, Password, and Security">
          <p className="mb-4">
            If You use the Platform, You shall be responsible for maintaining the confidentiality of your Display Name and Password and You shall be responsible for all activities that occur under your Display Name and Password...
          </p>
          <ul className="list-disc pl-8 space-y-2 mb-4">
            <li>If there's reason to believe security breach is likely, We may request password change</li>
            <li>Your mobile number is primary identifier - keep it updated</li>
            <li>Data deleted after 2 years of inactivity</li>
          </ul>
        </Section>

        {/* Section 2: Services Offered */}
        <Section title="2. Services Offered">
          <p className="mb-4">
            colour indigo provides Internet-based services enabling Users to purchase original merchandise (clothing, accessories, etc.)...
          </p>
          <p className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 mb-4">
            <span className="font-semibold">Important:</span> Return requests require confirmation that product is unused with original tags intact. Used/damaged products will be re-shipped at customer's expense.
          </p>
        </Section>

        {/* Section 3: Platform for Transactions */}
        <Section title="3. Platform for Transaction and Communication">
          <p className="mb-4">
            The Users utilize to meet and interact for transactions. colour indigo is not a party to transactions between Users...
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <ul className="list-disc pl-8 space-y-2">
              <li>All commercial terms agreed between Buyers/Sellers only</li>
              <li>colour indigo doesn't guarantee product specifics or performance</li>
              <li>Pricing may be incorrect due to technical errors</li>
            </ul>
          </div>
        </Section>

        {/* Section 4: User Conduct */}
        <Section title="4. User Conduct and Rules on the Platform">
          <p className="mb-4">
            You agree Your use shall be governed by these principles...
          </p>
          
          <SubSection title="Prohibited Content:">
            <ul className="list-disc pl-8 space-y-2">
              <li>Content belonging to others without rights</li>
              <li>Harmful, harassing, defamatory, or unlawful material</li>
              <li>Spam or unsolicited communications</li>
            </ul>
          </SubSection>
          
          <SubSection title="Fraud Indicators:">
            <ul className="list-disc pl-8 space-y-2">
              <li>Failure to respond to verification requests</li>
              <li>Use of invalid addresses/phone numbers</li>
              <li>Excessive returns or compensation requests</li>
            </ul>
          </SubSection>
        </Section>

        {/* More sections would follow the same pattern... */}

        {/* Contact Information */}
        <section className="mt-12 p-6 bg-indigo-50 rounded-lg border border-indigo-100">
          <h2 className="text-xl font-semibold text-indigo-800 mb-3">Contact Information</h2>
          <p className="mb-2">
            <span className="font-medium">Grievance Officer:</span> Adv. Vijay Kumar
          </p>
          <p className="mb-2">
            <span className="font-medium">Customer Support:</span> 080-61561999
          </p>
          <a 
            href="https://www.colourindigo.com/contactus" 
            className="text-indigo-600 hover:underline inline-block mt-2"
          >
            https://www.colourindigo.com/contactus
          </a>
        </section>

        <p className="text-sm text-gray-500 mt-8 italic">
          Last updated: May 30, 2025
        </p>
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

export default TermsOfUse;