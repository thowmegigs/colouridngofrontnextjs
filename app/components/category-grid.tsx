import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    id: 1,
    name: "Fashion",
    image: "/placeholder.svg?height=300&width=300",
    link: "/category/fashion",
  },
  {
    id: 2,
    name: "Electronics",
    image: "/placeholder.svg?height=300&width=300",
    link: "/category/electronics",
  },
  {
    id: 3,
    name: "Home",
    image: "/placeholder.svg?height=300&width=300",
    link: "/category/home",
  },
  {
    id: 4,
    name: "Beauty",
    image: "/placeholder.svg?height=300&width=300",
    link: "/category/beauty",
  },
  {
    id: 5,
    name: "Sports",
    image: "/placeholder.svg?height=300&width=300",
    link: "/category/sports",
  },
  {
    id: 6,
    name: "Toys",
    image: "/placeholder.svg?height=300&width=300",
    link: "/category/toys",
  },
  {
    id: 7,
    name: "Books",
    image: "/placeholder.svg?height=300&width=300",
    link: "/category/books",
  },
  {
    id: 8,
    name: "Jewelry",
    image: "/placeholder.svg?height=300&width=300",
    link: "/category/jewelry",
  },
]

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {categories.map((category) => (
        <Link key={category.id} href={category.link} className="group">
          <div className="flex flex-col items-center">
            <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 border border-border group-hover:border-primary transition-colors">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                width={300}
                height={300}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <span className="text-sm font-medium text-center">{category.name}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
