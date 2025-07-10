import Link from "next/link";
import SafeImage from "./SafeImage";

export default function CollectionBanners({ data }: any) {
  return (
    <div className="bg-muted">
      <div className="container px-0 mx-0 my-0">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
          {data.collections1.map((collection: any) => (
            <Link
              key={collection.id}
              href={`/collection/${collection.slug}`}
              className="group"
            >
              <div className="relative overflow-hidden">
                <SafeImage
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.name}
                  width={600} // estimated large screen width
                  height={300} // optional, helps maintain aspect ratio
                  sizes="(max-width: 768px) 33vw, (max-width: 1024px) 20vw, 16.66vw"
                  className="w-full rounded-md transition-transform group-hover:scale-105"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
