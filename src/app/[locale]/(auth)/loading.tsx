export default function AuthLoading() {
  return (
    <div className="flex h-screen overflow-hidden animate-pulse">
      {/* Left hero panel skeleton */}
      <div className="relative w-1/2 max-lg:hidden bg-gray-200" />

      {/* Right form skeleton */}
      <div className="flex w-full flex-col lg:w-1/2 bg-white">
        <main className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-24">
          <div className="mx-auto w-full max-w-120 space-y-6">
            {/* Heading */}
            <div className="space-y-2">
              <div className="h-7 w-48 rounded-md bg-gray-200" />
              <div className="h-4 w-64 rounded-md bg-gray-100" />
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <div className="h-10 w-full rounded-md bg-gray-200" />
              <div className="h-10 w-full rounded-md bg-gray-200" />
            </div>

            {/* Button */}
            <div className="h-10 w-full rounded-md bg-gray-300" />
          </div>
        </main>
      </div>
    </div>
  );
}
