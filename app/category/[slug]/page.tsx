import type { Metadata } from "next"
import CategoryPage from "./category-page"

type Props = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // In a real app, fetch category data based on slug
  const category = {
    name: params.slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    description: `Shop our collection of ${params.slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")} products.`,
  }

  return {
    title: category.name,
    description: category.description,
    openGraph: {
      title: category.name,
      description: category.description,
    },
  }
}

export default async function Page({ params }: Props) {
  const { slug } =await  params

  return <CategoryPage slug={slug} />
}
