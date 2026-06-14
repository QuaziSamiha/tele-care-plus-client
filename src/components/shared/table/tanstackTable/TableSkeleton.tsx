interface ITableSkeletonProps {
  columns: number;
  rows: number;
}

export default function TableSkeleton({ columns, rows }: ITableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={rowIdx} className="border border-gray-100 animate-pulse">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <td key={colIdx} className="px-6 py-4">
              <div className="h-4 w-full bg-gray-100 rounded" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}