import { api_url } from "@/contant";
import axios from "axios";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useState } from "react";

export default function PincodeChecker({ product_id }: any) {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const checkAvailability = async () => {
    if(pincode.length<2) return 
    setStatus(null);
    setMessage("Checking...");
    setLoading(true);
    try {
      // Replace with real API call
      const res = await axios.post(`${api_url}/shiprocket/check-serviceability-single-product`, {
        toPincode: pincode, product_id: product_id
      });
      const data = await res.data;
      console.log('deko', data)
      if (data) {
        setStatus("success");
        setMessage("Delivery is available to this pincode.");
      } else {
        setStatus("error");
        setMessage("Sorry, we do not deliver to this pincode.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md border rounded-xl p-4 shadow-sm bg-white mt-6">
      <h3 className="text-md font-semibold mb-3">Check Delivery Available ?</h3>
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Enter Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={checkAvailability}
          disabled={loading}
          className="bg-gray-200 hover:bg-primary text-sm text-black px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Check"
          )}
        </button>
      </div>

      {status !== null && (
        <div className={`mt-3 flex items-center gap-2 text-sm ${status === "success" ? "text-green-600" : "text-red-600"
          }`}>
          {status === "success" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
