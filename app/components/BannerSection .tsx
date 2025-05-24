import Link from "next/link";

const BannerSection = ({ banners }: { banners: string[] }) => {
  const columnCount = banners.length;
  return (
    <div className={`grid grid-cols--1 sm:grid-cols-${columnCount} gap-2 !p-0 sm:gap-4 container mx-auto`}>
      {banners.map((banner:any, idx) => (
        <Link key={idx} href={`/collection/${banner.collection_id}`} className="block w-full">
          <div className="overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
            <img
              src={`https://colourindogo.test/storage/website_banners/${banner.name}`}
              alt={`Banner ${idx + 1}`}
              className="w-full object-fit h-32 sm:h-64"
            />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BannerSection;
