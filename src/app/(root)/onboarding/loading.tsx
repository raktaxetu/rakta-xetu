import { Spinner } from "@/components/spinner";

export default function Loading() {
  return (
    <div className="min-h-svh w-full flex justify-center items-center">
      <Spinner />
    </div>
  );
}
