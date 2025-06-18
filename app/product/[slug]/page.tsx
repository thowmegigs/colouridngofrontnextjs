import { image_base_url } from "@/contant"
import { fetchProductDetail } from "@/lib/api"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import type { Metadata } from "next"
import ProductDetail from "./product-detail"

type Props = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } =await  params
   
    const product = await fetchProductDetail(slug as string)
 
    return {
      title: product.meta_title??product.name ,
      description: product.meta_description.length===0 ?
       product.short_description || product.description.replace(/<[^>]*>/g, "").substring(0, 160):product.meta_description,
      openGraph: {
        title: product.meta_title??product.name,
        description: product.meta_description.length===0 ?
        product.short_description || product.description.replace(/<[^>]*>/g, "").substring(0, 160):product.meta_description,
        images: [`${image_base_url}/storage/products/${product.id}/${product.image}`],
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
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['product',slug],
    queryFn: () => fetchProductDetail(slug),
  });


  return (
     <HydrationBoundary state={dehydrate(queryClient)}>
    <div className="container py-2 md:py-4">
      
      <ProductDetail slug={slug} />
    </div>
    </HydrationBoundary>
  )
}
