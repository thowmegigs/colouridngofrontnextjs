// app/page.tsx
import { fetchContentSections, fetchTopCategories } from "@/lib/api"
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import HomePageContent from "./components/HomePageContent"

export default async function Home() {
  const queryClient = new QueryClient()
  // await queryClient.prefetchQuery({
  //   queryKey: ["slider"],
  //   queryFn: fetchTopSlider,
  // })

  await queryClient.prefetchQuery({
    queryKey: ["topCategories"],
    queryFn: fetchTopCategories,
  })
  await queryClient.prefetchQuery({
    queryKey: ["content_sections"],
    queryFn: fetchContentSections,
    staleTime: 0,                // Always consider data stale immediately
    
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-2 pb-12 px-2 md:px-0">
        {/* <div className="md:px-9">
          <HeroSlider />
        </div>
         */}


        <HomePageContent />

         
          {/* <BrandCarousel /> */}
       
      </div>
    </HydrationBoundary>
  )
}
