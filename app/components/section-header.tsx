import SafeImage from "./SafeImage"

const SectionHeader = ({ section }: { section: any }) => {
  if (section.show_header !== "Yes") return null

  return (
    <div className={`mb-${section.header_image?0:3} md:mb-${section.header_image?0:6}`}>
      {section.header_image ? (
        <SafeImage
          width={40000}
          height={0}
          alt=""
          src={section.header_image}
          className="w-full h-100 object-cover"
        />
      ) : (
        <>
          <h2 className="text-xl md:text-2xl font-bold text-center">{section.section_title}</h2>
          {section.section_subtitle && (
            <h2 className="text-sm md:text-base font-normal">{section.section_subtitle}</h2>
          )}
        </>
      )}

      {/* {section.collections1?.[0]?.slug && (
        <Link
          href={`/collection/${section.collections1[0].slug}`}
          className="text-xs md:text-sm font-medium text-primary flex items-center mt-2"
        >
          View All
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      )} */}
    </div>
  )
}

export default SectionHeader
