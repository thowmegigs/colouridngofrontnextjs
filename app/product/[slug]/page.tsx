import { fetchProductDetail } from "@/lib/api"
import type { Metadata } from "next"
import ProductDetail from "./product-detail"

type Props = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // Fetch product data based on slug
    const product = await fetchProductDetail(params.slug as string)

    return {
      title: product.meta_title??product.name ,
      description: product.meta_description.length===0 ?
       product.short_description || product.description.replace(/<[^>]*>/g, "").substring(0, 160):product.meta_description,
      openGraph: {
        title: product.nameproduct.meta_title??product.name,
        description: product.meta_description.length===0 ?
        product.short_description || product.description.replace(/<[^>]*>/g, "").substring(0, 160):product.meta_description,
        images: [product.image],
        type: "article",
      },
    }
  } catch (error) {
    return {
      title: "Product Details",
      description: "View product details",
    }
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } =await  params

  return (
    <div className="container py-8">
      
      <ProductDetail slug={slug} />
    </div>
  )
}
