export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="animate-pulse space-y-6">
        <div className="h-16 bg-gray-200 rounded-lg mb-8"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}