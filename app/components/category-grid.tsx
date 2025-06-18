import Link from "next/link"
import { capitalize } from "../lib/utils"
import SafeImage from "./SafeImage"


export default function CategoryGrid({categories}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {categories.map((category) => (
        <Link key={category.id} href={`/category/${category.slug}`} className="group">
          <div className="flex flex-col items-center">
            <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 border border-border group-hover:border-primary transition-colors">
               <SafeImage
                             src={category.image}
                             alt={category.name}
                width={300}
                height={300}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <span className="text-sm font-medium text-center">{capitalize(category.name)}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
