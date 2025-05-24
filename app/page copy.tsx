// // app/page.tsx
// import { fetchTopCategories, fetchTopSlider } from "@/lib/api"
// import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
// import { ChevronRight } from "lucide-react"
// import Link from "next/link"
// import BrandCarousel from "./components/brand-carousel"
// import CategoryCircles from "./components/category-circles"
// import CategoryGrid from "./components/category-grid"
// import CollectionBanners from "./components/collection-banners"
// import HeroSlider from "./components/hero-slider"
// import MasonryGrid from "./components/masonry-grid"
// import OffersSection from "./components/offers-section"
// import ProductCarousel from "./components/product-carousel"
// import VideoAdvertisement from "./components/video-advertisement"

// export default async function Home() {
//   const queryClient = new QueryClient()

//   await queryClient.prefetchQuery({
//     queryKey: ["slider"],
//     queryFn: fetchTopSlider,
//   })

//   await queryClient.prefetchQuery({
//     queryKey: ["topCategories"],
//     queryFn: fetchTopCategories,
//   })

//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       <div className="space-y-12 pb-20">
//         <HeroSlider />

//         <div className="container">
//           <VideoAdvertisement />
//         </div>

//         <div className="md:hidden container">
//           <h2 className="section-title">Shop by Category</h2>
//           <CategoryCircles />
//         </div>

//         <div className="hidden md:block container">
//           <h2 className="section-title">Shop by Category</h2>
//           <CategoryGrid />
//         </div>

//         <div className="container">
//           <OffersSection />
//         </div>

//         <div className="container">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl md:text-3xl font-bold">New Arrivals</h2>
//             <Link href="/new-arrivals" className="text-sm font-medium text-primary flex items-center">
//               View All
//               <ChevronRight className="h-4 w-4 ml-1" />
//             </Link>
//           </div>
//           <ProductCarousel type="horizontal" />
//         </div>

//         <div className="container">
//           <h2 className="section-title">Shop by Collection</h2>
//           <MasonryGrid />
//         </div>

//         <div className="container">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
//             <Link href="/featured" className="text-sm font-medium text-primary flex items-center">
//               View All
//               <ChevronRight className="h-4 w-4 ml-1" />
//             </Link>
//           </div>
//           <ProductCarousel type="featured" title="Featured Products" viewAllLink="/featured" />
//         </div>

//         <CollectionBanners />

//         <div className="container">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl md:text-3xl font-bold">Best Sellers</h2>
//             <Link href="/best-sellers" className="text-sm font-medium text-primary flex items-center">
//               View All
//               <ChevronRight className="h-4 w-4 ml-1" />
//             </Link>
//           </div>
//           <ProductCarousel type="bestsellers" title="Best Sellers" viewAllLink="/best-sellers" />
//         </div>

//         <div className="container">
//           <h2 className="section-title">Shop by Brand</h2>
//           <BrandCarousel />
//         </div>
//       </div>
//     </HydrationBoundary>
//   )
// }
