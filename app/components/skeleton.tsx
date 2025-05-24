export const SliderSkeleton=()=>{
 return  <div className="relative h-[180px] sm:h-[70vh] overflow-hidden animate-pulse">
  <div className="absolute inset-0 bg-gray-300" />
  <button
    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-400"
    disabled
  />
  <button
    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-400"
    disabled
  />
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="w-2 h-2 rounded-full bg-white/50"
      />
    ))}
  </div>
</div>
}