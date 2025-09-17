"use client";

import { apiRequest, fetchSetting } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Mail, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";
import { showToast } from "../../components/show-toast";
import { useAuth } from "../../providers/auth-provider";

const phoneNumber = "+919991110716";

export default function ContactScreen() {
  const [enquiryForm, setEnquiryForm] = useState({ subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {isAuthenticated}=useAuth()
   const { data: setting } = useQuery<any>({
    queryKey: ["setting"],
    queryFn: () => fetchSetting(),
  
  })
  const handleInputChange = (field: string, value: string) => {
    setEnquiryForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!enquiryForm.subject.trim()) return false;
    if (!enquiryForm.message.trim()) return false;
    return true;
  };

  const handleSubmitEnquiry = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await apiRequest("sendEnquiry", { method: "POST", requestData: enquiryForm });
      setEnquiryForm({ subject: "", message: "" });
        showToast({ title: '', description: "Message sent successfully,Wait for reply or callback" })
    } catch (error: any) {
    
       showToast({ description:"Sorry some error has occurred",variant:"destructive"})
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmail = () => {
    window.location.href = `mailto:support@colourindigo.com?subject=Help Request&body=Hi, I need help with...`;
  };

  const handleCall = () => {
    if (confirm(`Do you want to call ${setting?.phone??phoneNumber}?`)) {
      window.location.href = `tel:${setting?.phone??phoneNumber}`;
    }
  };

  const handleWhatsApp = () => {
    const message = "Hi, I need help with my order";
    window.open(`https://wa.me/${setting?.phone??phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const ContactOption = ({ icon: Icon, title, description, onClick, color }: any) => (
    <div
      className="flex items-center bg-white p-4 mb-3 rounded-xl border-l-4 shadow cursor-pointer hover:shadow-md transition"
      style={{ borderLeftColor: color }}
      onClick={onClick}
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-full mr-4" style={{ backgroundColor: `${color}20` }}>
        <Icon size={24} color={color} />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-lg" style={{ color }}>{title}</p>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
      <ChevronRight size={20} className="text-gray-400" />
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-primary text-white px-6 py-8 text-center">
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-lg mt-2">We're here to help you with any questions or concerns</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Contact Buttons */}
          <div className="lg:w-1/2">
            <h2 className="text-2xl font-bold text-primary mb-4">Contact Us</h2>
            <ContactOption icon={Mail} title="Email Support" description="support@colourindigo.com" onClick={handleEmail} color="var(--tw-color-primary)" />
            <ContactOption icon={Phone} title="Call Support" description={`Call us at ${setting?.phone??phoneNumber}`} onClick={handleCall} color="#16a34a" />
            <ContactOption icon={MessageSquare} title="WhatsApp Chat" description="Chat with us instantly" onClick={handleWhatsApp} color="#25D366" />
          </div>

          {/* Right: Enquiry Form */}
          <div className="lg:w-1/2">
            <h2 className="text-2xl font-bold text-primary mb-4">Send us an Enquiry</h2>
            <p className="text-gray-500 mb-6">Fill out the form and we'll get back to you soon.</p>

            <div className="bg-white p-6 rounded-xl shadow">
              <label className="block text-sm font-semibold text-primary mb-2">Subject *</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:ring focus:ring-primary"
                placeholder="Enter the subject"
                value={enquiryForm.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
              />

              <label className="block text-sm font-semibold text-primary mb-2">Message *</label>
              <textarea
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:ring focus:ring-primary"
                placeholder="Describe your issue or question"
                value={enquiryForm.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
              />

              <button
                onClick={handleSubmitEnquiry}
                disabled={isSubmitting}
                className={`w-full py-2 rounded-lg text-white font-semibold ${isSubmitting ? "bg-gray-400" : "bg-primary hover:opacity-90"}`}
              >
                {isSubmitting ? "Submitting..." : "Submit Enquiry"}
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-primary mb-6">Frequently Asked Questions</h2>
          <div className="grid gap-4">
            {[
              { q: "How can I track my order?", a: "Go to 'Orders' in your profile and select the specific order." },
              { q: "What is your return policy?", a: `We offer a ${setting?.return_days??3}-day return policy for most items if in original condition.` },
              { q: "How long does shipping take?", a: "Normal shipping takes 3-7 business days." },
              { q: "Do you offer international shipping?", a: "Currently, we only ship within the country." }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg shadow">
                <p className="font-semibold text-primary">{faq.q}</p>
                <p className="text-gray-500 text-sm mt-1">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
