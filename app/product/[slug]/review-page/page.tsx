'use client';

import ReviewImagesGallery from "@/app/components/review-image-gallery";
import { getRatingColors } from "@/app/components/review-section";
import { useAuth } from "@/app/providers/auth-provider";
import { fetchProductDetail } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useState } from "react";

export default function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const avgRating = searchParams.get("avgRating");

  const { data: product } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductDetail(slug as any),
  });

  const allReviewImages = product
    ? product.reviews.flatMap((review) => review.images).map((src) => ({ src }))
    : [];

  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleWriteReviewClick = () => {
    if (isAuthenticated) {
      setShowReviewForm(true);
    } else {
      router.push(`/auth/login?redirect=/product/${product.slug}`);
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString();

 

  return (
    <div id="reviews" className="my-5 px-3">
      <h2 className="text-xl font-bold pb-2">Customer Reviews</h2>

      {product && product.reviews.length > 0 ? (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column: Ratings */}
          <div className="w-full md:w-1/3">
            <div className="border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Ratings</h3>
              </div>

              <div className="flex items-start gap-6">
                {/* Average Rating & Total Reviews */}
                <div className="flex flex-col items-center justify-center w-1/3">
                  <div className="text-5xl font-bold text-gray-900">{avgRating}</div>
                  <div className="flex my-2">
                    <Star className={`h-6 w-6 ${getRatingColors(Number(avgRating)).text} fill-current`} />
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
                          <div
                            className={`absolute left-0 top-0 h-2 rounded-full ${darkBg}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-8 text-sm text-gray-600 text-right">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Photos (top) + Reviews */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Customer Photos (on top in desktop, below ratings in mobile) */}
            {allReviewImages.length > 0 && (
              <div className="rounded-xl border  p-2 py-3 shadow-sm hover:shadow-md transition-all">
                <h1 className="text-sm mb-2 font-bold">Customer Photos</h1>
                <ReviewImagesGallery allImages={allReviewImages} />
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-2">
              {product.reviews.map((review) => {
                const colors = getRatingColors(review.rating);
                return (
                  <div
                    key={review.id}
                    className="flex gap-4 border rounded-xl p-3 shadow-sm bg-white hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`p-1 rounded-sm px-2 flex items-center justify-center ${colors.darkBg} text-white text-xs`}
                      >
                        <span>{Math.floor(review.rating)}</span>
                        <Star className="w-3 h-3 ml-1 fill-current" />
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                      <ReviewImagesGallery
                        allImages={review.images.map((img) => ({ src: img }))}
                      />
                      <div className="text-xs text-gray-500 border-t pt-2">
                        {review.user_name ?? "Genuine User"} | {formatDate(review.created_at)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500 mb-4">No reviews yet. Be the first to review this product!</p>
          <button className="bg-primary text-white px-4 py-2 rounded-lg">
            Write a Review
          </button>
        </div>
      )}
    </div>
  );
}
