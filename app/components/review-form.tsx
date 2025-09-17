"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

import { submitProductReview } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Camera, CheckCircle, Star, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"


const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const MAX_IMAGES = 5

const formSchema = z.object({

  rating: z
    .number()
    .min(1, {
      message: "Please select a rating.",
    })
    .max(5),
  comment: z
    .string()
    .min(10, {
      message: "Review must be at least 10 characters.",
    })
    .max(500, {
      message: "Review must not exceed 500 characters.",
    }),
  images: z
    .array(
      z.object({
        file: z
          .instanceof(File)
          .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
          .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported.",
          ),
        preview: z.string(),
      }),
    )
    .max(MAX_IMAGES, `You can upload a maximum of ${MAX_IMAGES} images.`)
    .optional(),
})

type ReviewFormProps = {
  productId: number
  onSuccess: (review: any) => void
  onCancel: () => void
}

export function ReviewForm({ productId, onSuccess, onCancel }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [uploadedImages, setUploadedImages] = useState<{ file: File; preview: string }[]>([])
  
  const showSuccess = (message: string) => {
    setAlert({ type: 'success', message });
    setTimeout(() => setAlert(null), 30000); // Auto-dismiss
  };

  const showError = (message: string) => {
    setAlert({ type: 'error', message });
    setTimeout(() => setAlert(null), 30000);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      images: [],
    },
  })

  // Update form value when uploadedImages changes
  useEffect(() => {
    form.setValue("images", uploadedImages)
  }, [uploadedImages, form])

  // Clean up previews when component unmounts
  useEffect(() => {
    return () => {
      uploadedImages.forEach((image) => {
        URL.revokeObjectURL(image.preview)
      })
    }
  }, [uploadedImages])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Check if adding these files would exceed the limit
    if (uploadedImages.length + files.length > MAX_IMAGES) {
      showError(`You can upload a maximum of ${MAX_IMAGES} images.`)
      return
    }

    const newImages = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setUploadedImages((prev) => [...prev, ...newImages])

    // Reset the input value so the same file can be selected again if removed
    e.target.value = ""
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => {
      const newImages = [...prev]
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
   
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("product_id", String(productId))
      formData.append("user_name", "nme")
      formData.append("user_id", "2")
      formData.append("rating", String(values.rating))
      formData.append("comment", values.comment)

      uploadedImages.forEach((img, index) => {
        formData.append('images', img.file)
      })

      // Make sure your API supports multipart/form-data
      const newReview = await submitProductReview(formData)

      showSuccess(newReview['message'])
   
onSuccess(newReview)
      // onSuccess(newReview)
    } catch (error: any) {
      console.log('giot erro', error.message)
      showError(error.message)

    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} >


        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="p-1"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => field.onChange(star)}
                    >
                      <Star
                        className={`h-6 w-6 ${(hoverRating ? star <= hoverRating : star <= field.value)
                          ? "text-amber-500 fill-current"
                          : "text-muted-foreground"
                          }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {field.value > 0 ? `${field.value} star${field.value > 1 ? "s" : ""}` : "Select rating"}
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience with this product..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>Your review will help other shoppers make better decisions.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Add Photos (Optional)</FormLabel>
              <FormDescription>
                Upload up to {MAX_IMAGES} images to show your experience with the product.
              </FormDescription>

              <div className="mt-2">
                <div className="flex flex-wrap gap-2">
                  {/* Image previews */}
                  {uploadedImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative w-16 h-16 md:w-20 md:h-20 border rounded-md overflow-hidden group"
                    >
                      <Image
                        src={image.preview || "/placeholder.svg"}
                        alt={`Review image ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 bg-black/70 text-white p-1 rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}

                  {/* Upload button */}
                  {uploadedImages.length < MAX_IMAGES && (
                    <label className="flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 border border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col items-center justify-center">
                        <Camera className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-1">Add</span>
                      </div>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        className="hidden"
                        onChange={handleImageUpload}
                        multiple
                      />
                    </label>
                  )}
                </div>

                {uploadedImages.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {uploadedImages.length} of {MAX_IMAGES} images added
                  </p>
                )}
              </div>

              <FormMessage />
            </FormItem>
          )}
        />
        {alert && (
          <div
            className={`flex items-center gap-3 mb-4 px-4 py-3 rounded relative border ${alert.type === 'success'
                ? 'bg-green-50 text-green-800 border-green-200'
                : 'bg-red-50 text-red-800 border-red-200'
              }`}
          >
            {alert.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span>{alert.message}</span>
          </div>
        )}

        <div className="flex justify-end gap-4">


          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
