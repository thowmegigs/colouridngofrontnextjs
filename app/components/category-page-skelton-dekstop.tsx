
export default function CategoryPageSkeletonDesktop() {
  return (
    <div className="p-4 lg:flex lg:gap-6">
      {/* Left: Filters skeleton (hidden on mobile) */}
      <div className="hidden lg:block w-1/4 space-y-4 sticky top-4 h-fit animate-pulse">
        <div className="h-6 w-1/2 bg-gray-300 rounded" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-3/4" />
        ))}
        <div className="h-6 w-1/2 bg-gray-300 rounded mt-6" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-2/3" />
        ))}
      </div>

      {/* Right: Content */}
      <div className="w-full lg:w-3/4">
        {/* Child categories */}
        <div className="flex overflow-x-auto space-x-4 pb-4 animate-pulse">
          {Array.from({ length:4}).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gray-300" />
              <div className="h-3 w-16 bg-gray-300 rounded mt-2" />
            </div>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-2 bg-white shadow-sm">
              <div className="w-full h-40 bg-gray-300 rounded mb-2" />
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-1" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
