import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const collections = [
  {
    id: 1,
    title: "Summer Sale",
    description: "Up to 50% off on selected items",
    image: "/placeholder.svg?height=300&width=600",
    link: "/sale/summer",
    color: "bg-pink-600",
  },
  {
    id: 2,
    title: "New Season",
    description: "Discover the latest trends",
    image: "/placeholder.svg?height=300&width=600",
    link: "/collection/new-season",
    color: "bg-purple-600",
  },
  {
    id: 3,
    title: "Exclusive Deals",
    description: "Limited time offers",
    image: "/placeholder.svg?height=300&width=600",
    link: "/deals",
    color: "bg-blue-600",
  },
]

export default function CollectionBanners({data}:any) {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  return (
    <div className="bg-muted py-12">
      <div className="container">
        <h2 className="section-title">{data.section_title}</h2>
       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.collections1.map((collection:any) => (
            <Link key={collection.id} href={`/collection/${collection.id}`} className="group">
              <div className="relative rounded-lg overflow-hidden">
                <Image
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.title}
                  width={600}
                  height={300}
                  className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                />
                <div className={`absolute inset-0 ${randomColor} bg-opacity-80 flex flex-col justify-center p-6`}>
                  <h3 className="text-white text-xl font-bold mb-2">{collection.title}</h3>
                  <p className="text-white/80 mb-4">{collection.subtitle}</p>
                  <div className="flex items-center text-white text-sm font-medium">
                    Shop Now
                    <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
