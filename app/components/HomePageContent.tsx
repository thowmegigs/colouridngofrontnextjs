"use client"

import { useMobile } from "@/hooks/use-mobile"
import { fetchContentSections } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import BannerSection from "./BannerSection "
import CategoryCircles from "./category-circles"
import CategoryGrid from "./category-grid"
import CollectionBanners from "./collection-banners"
import CollectionSlider from "./CollectionSlider"
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
                content = section.products ? (
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
                           {section.display=='Vertical'? <CollectionBanners data={section} />
                           :<CollectionSlider items={section.collections1} /> }
                           
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
      <section className="bg-gray-100 border rounded-md p-6 text-gray-800 text-sm leading-relaxed  container my-10 hidden md:block">
          <p className="mb-4">
            <span className="font-bold">DISCLAIMER:</span> Please be cautious of
            individuals falsely posing as colourindigo employees, affiliates, agents
            or representatives. They may attempt to deceive you by seeking
            personal information or soliciting money under the guise of offering
            opportunities to be a seller on our platform.{" "}
            <span className="font-bold">
              colourindigo does not charge any onboarding fee or refundable deposit
              from sellers.
            </span>{" "}
            We strongly advise you to exercise vigilance and disregard such
            offers.
          </p>

          <p className="mb-4">
            However, a{" "}
            <span className="font-semibold">one time growth enablement charge</span>{" "}
            is applicable for new sellers on colourindigo platform once the sellers
            start operating on the platform. The charge is{" "}
            <span className="font-semibold">netted off</span> against the payout
            colourindigo has to make to sellers for selling their products on colourindigo
            platform. The charge is used to provide{" "}
            <span className="font-semibold">
              access to product listing ad credits worth 2x the growth
              enablement charge and partner insights platform
            </span>{" "}
            in order to help sellers accelerate their growth. More details can
            be found in terms of use document.
          </p>

          <p className="mb-4">
            Please do not accept or entertain any email communication from email
            IDs that do not contain{" "}
            <span className="font-semibold">"@colourindigo.com"</span>. All colourindigo
            representatives' email IDs are expected to have{" "}
            <span className="font-semibold">"@colourindigo.com"</span> as part of
            their email addresses.
          </p>

          <p>
            Engaging in such fraudulent activities may lead to criminal and
            civil liabilities. We are committed to cooperating with law
            enforcement authorities to take appropriate action against these
            imposters. Please note that colourindigo, along with its affiliates and
            subsidiaries, cannot be held liable for any claims, losses, damages,
            expenses, or inconvenience resulting from the actions of these
            imposters.
          </p>
        </section>
          <section className="hidden md:block bg-gray-100 border rounded-md p-6 text-gray-800 text-sm leading-relaxed container my-10 hidden md:block">
      <div className="space-y-4">
        {/* Heading 1 */}
        <h6 className="font-bold text-base my-3">
          ONLINE SELLING MADE EASY AT Colourindigo
        </h6>
        <p>
          If you are looking to sell fashion, lifestyle, beauty & grooming and
          personal care products online, you are at the right place! When it
          comes to selling online, <span className="font-semibold">Colourindigo</span> is the
          ultimate destination for fashion, beauty and lifestyle, with a wide
          array of merchandise including clothing, footwear, accessories,
          jewelry, personal care products and more.
        </p>
        <p>
          With more than{" "}
          <span className="font-bold">55 million active users</span> every month
          and servicing over{" "}
          <span className="font-bold">17,000 pin codes across India</span>, you
          can grow your business by registering on India’s best fashion, beauty
          and lifestyle platform.
        </p>

        {/* Heading 2 */}
        <h6 className="font-bold text-base my-3">
          BEST ONLINE SHOPPING SITE IN INDIA FOR FASHION
        </h6>
        <p>
          Be it clothing, footwear or accessories, Colourindigo offers the ideal
          combination of fashion and functionality for men, women and kids. From
          affordable styles to luxury brands, Colourindigo as an online seller
          showcases a wide array of styles with loyal customers all across India.
        </p>
        <p>
          So whether your brand is massy or premium or has a very niche audience,
          if you are selling in India then you should be listed on Colourindigo.
        </p>

        {/* Heading 3 */}
        <h6 className="font-bold text-base my-3">
          BEST PLACE FOR ONLINE FASHION
        </h6>
        <p>
          Colourindigo is one of the unique online sellers in India where fashion
          is accessible to all. With a bunch of amazing filters and search
          options, customers across India find a wide range of products and
          styles for every budget. If you are listed on Colourindigo, selling
          will be extremely easy as customers will come across your listed
          products through various touch points.
        </p>
      </div>
    </section>
    </>


}
