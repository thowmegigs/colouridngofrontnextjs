import type { Metadata } from "next"
import CollectionPage from "./collection-page"

type Props = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
   const { slug } =await  params
  const category = {
    name:slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    description: `Shop our collection of ${slug
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

  return <CollectionPage slug={slug} />
}
