import Link from "next/link";
import SafeImage from "./SafeImage";

const BannerSection = ({ banners }: { banners: string[] }) => {
  const columnCount = banners.length;
  return (
    <div className={`grid grid-cols-${columnCount == 1 ? 1 : 2} sm:grid-cols-${columnCount} gap-3 md:gap-13 container px-1 mx-auto`}>
      {banners.map((banner: any, idx) => (
        <Link key={idx} href={`/collection/${banner.slug}`} className="block w-full">
          <div className="overflow-hidden shadow-lg rounded-md">
            <SafeImage
              src={banner.image}
              alt={`Banner ${idx + 1}`}
              width={1200} // estimated natural width — no need to be exact
              height={0}   // allows height to adjust automatically
              sizes={`
                (max-width: 640px) ${columnCount === 1 ? '100vw' : '50vw'},
                (max-width: 1024px) ${100 / columnCount}vw,
                ${100 / columnCount}vw
              `}
              className="w-full h-auto object-contain"
            />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BannerSection;
