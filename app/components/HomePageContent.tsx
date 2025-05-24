"use client"

import { fetchContentSections } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import BannerSection from "./BannerSection "
import CollectionBanners from "./collection-banners"
import MasonryGrid from "./masonry-grid"
import OffersSection from "./offers-section"
import ProductCarousel from "./product-carousel"
import ProductCarouselCollection from "./product-carousel-collection"
import Slider from "./slider"
import VideoAdvertisement from "./video-advertisement"

export default function HomePageContent() {
    // Use the dynamic api_url in the queryFn
    const { data: content_sections, isLoading, error } = useQuery({
        queryKey: ["content_sections"],
        queryFn: fetchContentSections,
        staleTime: 0,                // Always consider data stale immediately
       
    })
   

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error loading hone conte</div>
    }

    if (!content_sections?.length) {
        return <div>No slides available</div>
    }

    return (  content_sections.map((section: any, index: number) => {
                    let content = null;

                    switch (section.content_type) {
                        case "Slider":
                            content = <Slider section_data={section} />;
                            break;
                        case "Coupons":
                            content = <OffersSection data={section} />;
                            break;
                        case "Banner":
                            content = <BannerSection banners={section.json_column} />;
                            break;
                        case "Video":
                            content = <VideoAdvertisement data={section} />;
                            break;
                        case "Products":
                            content = (
                                <>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2sm md:text-xl font-bold">{section.section_title}</h2>
                                        <Link href="/new-arrivals" className="text-xs md:text-sm font-medium text-primary flex items-center">
                                            View All
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Link>
                                    </div>
                                    <ProductCarousel section={section} />
                                </>
                            );
                            break;
                        case "Collections":
                            if (section.collection_products_when_single_collection_set) {
                                content = (
                                    <>
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2sm md:text-xl  font-bold">{section.section_title}</h2>
                                            <Link href="/new-arrivals" className="text-xs md:text-sm font-medium text-primary flex items-center">
                                                View All
                                                <ChevronRight className="h-4 w-4 ml-1" />
                                            </Link>
                                        </div>
                                        <ProductCarouselCollection section={section} />
                                    </>
                                );
                            } else {
                                content = section.is_masornary === 'Yes' 
                                    ? <MasonryGrid /> 
                                    : <CollectionBanners data={section} />;
                            }
                            break;
                        default:
                            return null;
                    }

                    return (
                        <div key={index} className="container !my-7 !p-0">
                            {content}
                        </div>
                    );
                })
            )
     

        }
