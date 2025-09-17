import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../providers/auth-provider";
import { ReviewForm } from "./review-form";
import ReviewImagesGallery from "./review-image-gallery";
export  const getRatingColors = (rating: number) => {
  if (rating >= 4.5) {
    return { text: "text-green-600", darkBg: "bg-emerald-600" }; // Excellent
  }
  if (rating >= 4.0) {
    return { text: "text-green-500", darkBg: "bg-green-500" }; // Very Good
  }
  if (rating >= 3.0) {
    return { text: "text-yellow-600", darkBg: "bg-yellow-400" }; // Average
  }
  if (rating >= 2.0) {
    return { text: "text-orange-600", darkBg: "bg-orange-400" }; // Below Average
  }
  return { text: "text-red-600", darkBg: "bg-red-500" }; // Poor
};
export default function ReviewsSection({ product,avgproductRating,allReviewImages }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
const {isAuthenticated}=useAuth()

 const router = useRouter()
const handleViewMore = () => {
  router.push(`/product/${product.slug}/review-page?avgRating=${avgproductRating}`);
};
  
 
   const [showReviewForm, setShowReviewForm] = useState(false)
 const handleWriteReviewClick = () => {
    if (isAuthenticated) {
      setShowReviewForm(true)
    } else {
      router.push(`/auth/login?redirect=/product/${product.slug}`)
    }
  }
const calculateAverageRating = (reviews: any[]): number => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((total, review) => total + review.rating, 0)
    return Number((sum / reviews.length).toFixed(1))
  }
 const handleReviewSuccess = (newReview: any) => {
  
  setTimeout(()=>{
      setShowReviewForm(false);
  },3000)
};
 



  return (
    <div id="reviews" className="my-5">
      <h2 className="text-xl font-bold pb-2">Customer Rating & Reviews</h2>
    <div className="my-2">
 {allReviewImages.length > 0 && (
                        <div className="">
                          <div className="  p-2 py-3 shadow-sm hover:shadow-md transition-all">
                            <h1 className="text-sm mb-2 font-bold">Customer Photos</h1>
                            <ReviewImagesGallery allImages={allReviewImages} />
                          </div>
                        </div> 
                      )}
     
</div>
      {product.reviews.length > 0 ? (
        <div className="flex flex-col gap-1">
          {/* Ratings Summary Card */}
          <div className=" w-full md:w-[60%]">
            <div className=" border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Rating</h3>
              </div>

              <div className="flex items-start gap-6">
                {/* Average Rating & Total Reviews */}
                <div className="flex flex-col items-center justify-center w-1/3">
                  <div className="text-5xl font-bold text-gray-900">{avgproductRating.toFixed(1)}</div>
                  <div className="flex my-2">
                    <Star className={`h-6 w-6 ${getRatingColors(avgproductRating).text} fill-current`} />
                  </div>
                  <div className="text-sm text-gray-600">
                    {product.reviews.length} Review{product.reviews.length > 1 ? "s" : ""}
                  </div>
                </div>

                {/* Ratings Breakdown */}
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = product.reviews.filter((r) => Math.round(r.rating) === star).length;
                    const percentage = (count / product.reviews.length) * 100 || 0;
                    const { darkBg } = getRatingColors(star);

                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="w-4 text-sm">{star}</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full relative">
                          <div className={`absolute left-0 top-0 h-2 rounded-full ${darkBg}`} style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="w-8 text-sm text-gray-600 text-right">{Math.round(percentage)}%</span>
                      </div>
                    );
                  })}
                </div>
                 
              </div>
   <div className="flex justify-between gap-2">
      <button
                className="mt-6 text-sm w-full border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50 transition"
                onClick={handleWriteReviewClick}
              >
                Write a Review
              </button>
              <button
                  onClick={handleViewMore}
                  className="mt-6 text-sm w-full border border-gray-300 rounded-lg py-1 bg-primary text-white  transition"
                >
                  View All Reviews
                </button>

   </div>
            
            </div>
          </div>
          
         
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500 mb-4">No reviews yet. Be the first to review this product!</p>
          <button className="bg-primary text-white px-4 py-2 rounded-lg">Write a Review</button>
        </div>
      )}
     <Dialog open={showReviewForm} onOpenChange={(open) => setShowReviewForm(open)}>
              <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto py-5">
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                </DialogHeader>
                <div >
                  <ReviewForm
                    productId={product.id}
                    onSuccess={handleReviewSuccess}
                    onCancel={() => setShowReviewForm(false)}
                  />
                </div>
              </DialogContent>
            </Dialog>
    </div>
  );
}
