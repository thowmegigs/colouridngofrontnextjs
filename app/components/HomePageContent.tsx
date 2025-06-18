"use client"

import { useMobile } from "@/hooks/use-mobile"
import { fetchContentSections } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { useInView } from "react-intersection-observer"
import BannerSection from "./BannerSection "
import CategoryCircles from "./category-circles"
import CategoryGrid from "./category-grid"
import CollectionBanners from "./collection-banners"
import OffersSection from "./offers-section"
import ProductCarousel from "./product-carousel"
import ProductCarouselCollection from "./product-carousel-collection"
import SafeImage from "./SafeImage"
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


   
      

    if (error ||isLoading) {
        return <HomePageSkeleton/>
    }

    if (!content_sections?.length) {
        return <div>No slides available</div>
    }

    return (content_sections.map((section: any, index: number) => {
        let content = null;

        switch (section.content_type) {
            case "Slider":
                content = section.slider_data ? <Slider section_data={section} /> : null;
                break;
            case "Coupons":
                content = <OffersSection data={section} />;
                break;
            case "Banner":
                content = section.banner_data ? <BannerSection banners={section.banner_data} /> : null;
                break;
            case "Video":

                content = <VideoSlider data={section} />;
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
                        <div className="flex items-center justify-between mb-6">
                            {
                                section.header_image ?
                                    <SafeImage width={40000} alt="" src={section.header_image} height={0} className="w-full h-100 object-fit" />
                                    : (<>
                                        <h2 className="text-2sm md:text-xl font-bold">{section.section_title}</h2>
                                        {section.section_subtitle && <h2 className="text-sm md:text-sm font-normal">{section.section_subtitle}</h2>}
                                    </>)
                            }

                            {/* <Link href="/new-arrivals" className="text-xs md:text-sm font-medium text-primary flex items-center">
                                            View All
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Link> */}
                        </div>
                        <ProductCarousel section={section} />
                    </>
                ) : null;
                break;
            case "Collections":
                if (section.collection_products_when_single_collection_set) {
                    content = (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                {
                                    section.header_image ?
                                        <SafeImage width={40000} alt="" src={section.header_image} height={0} className="w-full h-100 object-fit" />
                                        : (<>
                                            <h2 className="text-2sm md:text-xl font-bold">{section.section_title}</h2>
                                            {section.section_subtitle && <h2 className="text-sm md:text-sm font-normal">{section.section_subtitle}</h2>}
                                        </>)
                                }
                                <Link href={`/collection/${section.collections1[0]['slug']}`} className="text-xs md:text-sm font-medium text-primary flex items-center">
                                    View All
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Link>
                            </div>
                            <ProductCarouselCollection section={section} />
                        </>
                    );
                } else {
                    // content = section.collection1 ? (section.display === 'Vertical'
                    //     ? <MasonryGrid />
                    //     : <CollectionBanners data={section} />) : null;
                    content =  <CollectionBanners data={section} />;
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
                    className={`container !my-2 !p-0 transition-opacity duration-1000 ease-out opacity-0"
                        }`}
                >
                    {content}
                </div>

            )
        );
    })
    )


}
