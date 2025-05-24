import { Scissors } from "lucide-react"; // Optional: Lucide or any icon library
import { useState } from "react";

const CouponBox = () => {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState(null);

  const handleApply = () => {
    if (code.trim().toLowerCase() === "save20") {
      setStatus({ type: "success", message: "Coupon applied successfully!" });
    } else {
      setStatus({ type: "error", message: "Invalid coupon code." });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 relative">
      <div className="border border-dashed border-gray-400 p-6 rounded-xl bg-white shadow-md relative">
        <h2 className="text-xl font-bold mb-4 text-gray-800">🎟️ Have a Coupon?</h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleApply}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Apply
          </button>
        </div>
        {status && (
          <p
            className={`mt-3 text-sm ${
              status.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status.message}
          </p>
        )}
        <div className="absolute top-3 left-3 text-gray-400">
          <Scissors size={20} />
        </div>
        <div className="absolute bottom-3 right-3 text-gray-400 transform rotate-180">
          <Scissors size={20} />
        </div>
      </div>
    </div>
  );
};

export default CouponBox;
