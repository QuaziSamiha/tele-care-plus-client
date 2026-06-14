export default function PaginationSkeleton() {
  return (
    <section className="bg-white px-6 py-3 animate-pulse">
      <div className="flex items-center justify-between mt-4">
        {/* Left side: Showing X–Y from Z */}
        <div className="flex gap-2 items-center">
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
          <div className="h-3 w-10 bg-gray-200 rounded"></div>
          <div className="h-3 w-8 bg-gray-200 rounded"></div>
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    </section>
  );
}
