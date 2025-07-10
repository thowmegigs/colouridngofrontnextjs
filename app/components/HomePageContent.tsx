"use client"

import { useMobile } from "@/hooks/use-mobile"
import { fetchContentSections } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import BannerSection from "./BannerSection "
import CategoryCircles from "./category-circles"
import CategoryGrid from "./category-grid"
import CollectionBanners from "./collection-banners"
import DynamicPreload from "./DynamicPreload"
import ErrorPage from "./Error"
import OffersSection from "./offers-section"
import ProductCarousel from "./product-carousel"
import ProductCarouselCollection from "./product-carousel-collection"
import SectionHeader from "./section-header"
import Slider from "./slider"
import VideoSlider from "./video-slider"
const HomePageSkeleton = () => {
    return (
        <div className="space-y-8 p-1 w-full mx-auto">
            {/* Slider with full-width box overlay */}
            <div className="relative w-full aspect-[3/1]  overflow-hidden">
                {/* Background shimmer */}
                <div className="absolute inset-0 bg-gray-300 animate-pulse" />

                {/* Overlay Box */}

            </div>

            {/* Category Circles */}
            <div className="flex gap-4 overflow-x-auto py-2">
                {[...Array(8)].map((_, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center min-w-[80px]">
                        <div className="w-16 h-16 rounded-full bg-gray-300 animate-pulse"></div>
                        <div className="mt-2 w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                ))}
            </div>

            {/* Grid Banners */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="aspect-[4/3] bg-gray-300 rounded-xl animate-pulse" />
                ))}
            </div>
        </div>
    );
}
export default function HomePageContent() {
    // Use the dynamic api_url in the queryFn
    const isMobile = useMobile()
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { data: content_sections, isLoading, error } = useQuery({
        queryKey: ["content_sections"],
        queryFn: fetchContentSections,
        //  staleTime: 0,                // Always consider data stale immediately

    })





    if (error || isLoading) {
        return <HomePageSkeleton />
    }

    if (!content_sections?.data.length) {
        return <ErrorPage /> 
    }
    let apiData=content_sections?.imageUrls??null
const assets = apiData?[
    ...apiData.images.map((url: string) => ({ url, type: "image" as const })),
    ...apiData.videos.map((url: string) => ({ url, type: "video" as const })),
  ]:[]

    return <>
    {assets.length>0 &&  <DynamicPreload assets={assets} />}
    {content_sections.data.map((section: any, index: number) => {
        let content = null;

        switch (section.content_type) {
            case "Slider":
                content = section.slider_data ? <div>
                    <SectionHeader section={section} />
                    <Slider section_data={section.slider_data} /></div> : null;
                break;
            case "Coupons":
                content = <OffersSection data={section} />;
                break;
            case "Banner":
                content = section.banner_data ? <div className="flex flex-col items-center justify-center">
                    <SectionHeader section={section} />
                    <BannerSection banners={section.banner_data} /></div> : null;
                break;
            case "Video":

                content = <div className="flex flex-col items-center justify-center">
                    <SectionHeader section={section} />
                    <VideoSlider data={section} /> </div>;
                break;
            case "Categories":
                const categories = section['categories1'] ? section['categories1'] : []
                if (isMobile) {
                    if (section['display'] == 'Horizontal')
                        content = categories.length > 0 ? <CategoryCircles categories={categories} /> : null;
                    else
                        content = categories.length > 0 ? <CategoryGrid categories={categories} /> : null;
                }
                else
                    content = null;
                break;
            case "Products":
                content = section.products1 ? (
                    <>
                        <div className="flex items-center justify-center">
                            <SectionHeader section={section} />
                        </div>
                        <ProductCarousel section={section} />
                    </>
                ) : null;
                break;
            case "Collections":
                if (section.collection_products_when_single_collection_set) {
                    content = (
                        <>
                            <div className="flex items-center justify-center">
                                <SectionHeader section={section} />
                            </div>
                            <ProductCarouselCollection section={section} />
                        </>
                    );
                } else {
                    content = (
                        <>
                            <div className="flex items-center justify-center">
                                <SectionHeader section={section} />
                            </div>
                            <CollectionBanners data={section} />
                        </>
                    );

                }
                break;
            default:
                return null;
        }

        return (
            content && (
                <div
                    ref={ref}
                    key={index}
                    // className={`container !my-7 !p-0 transition-opacity duration-1000 ease-out ${inView ? "animate-in slide-in-from-bottom fade-in" : "opacity-0"
                    //     }`}
                    className={`container  !my-3 md:!my-6 !p-0 transition-opacity duration-1000 ease-out opacity-0"
                        }`}
                >
                    {content}
                </div>

            )
        );
    })}
    </>


}
