export function Spinner() {
  return (
    <div
      className="animate-spin inline-block size-12 border-3 border-current border-t-transparent text-rose-600 rounded-full dark:text-rose-500"
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
