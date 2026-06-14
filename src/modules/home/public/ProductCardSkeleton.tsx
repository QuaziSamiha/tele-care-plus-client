export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col h-full gap-3 animate-pulse">
      <div className="bg-neutral-200 aspect-square rounded-lg" />
      <div className="flex flex-col gap-2 mt-auto">
        <div className="h-4 w-3/4 bg-neutral-200 rounded" />
        <div className="h-3 w-1/3 bg-neutral-200 rounded" />
        <div className="h-4 w-1/2 bg-neutral-200 rounded" />
      </div>
    </div>
  );
}
