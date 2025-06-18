
export default function CategoryPageSkeleton() {
  return (
    <div className="p-4">
      {/* Child categories (circular) */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {Array.from({ length: 4}).map((_, i) => (
          <div key={i} className="flex flex-col items-center animate-pulse">
            <div className="w-20 h-20 rounded-full bg-gray-300" />
            <div className="h-3 w-16 bg-gray-300 rounded mt-2" />
          </div>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border rounded-lg p-2 animate-pulse bg-white shadow-sm"
          >
            <div className="w-full h-32 bg-gray-300 rounded mb-2" />
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-1" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
