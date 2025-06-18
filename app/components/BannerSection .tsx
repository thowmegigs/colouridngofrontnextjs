import Link from "next/link";
import SafeImage from "./SafeImage";

const BannerSection = ({ banners }: { banners: string[] }) => {
  const columnCount = banners.length;
  return (
    <div className={`grid grid-cols-${columnCount==1?1:2} sm:grid-cols-${columnCount} gap-3 md:gap-13  mt-5 container  px-1 mx-auto`}>
      {banners.map((banner:any, idx) => (
        <Link key={idx} href={`/collection/${banner.collection_id}`} className="block w-full">
          <div className="overflow-hidden  shadow-lg  transition-transform duration-300">
            <SafeImage
              src={banner.image}
              alt={`Banner ${idx + 1}`}
              width={300}
              height={400}
              className={`w-full object-fit rounded-md h-[${columnCount==1?240:260}px] md:h-[600px] `}
            />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BannerSection;
