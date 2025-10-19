import { MyRequestsList } from "@/components/modules/request/my-requests";
import { Spinner } from "@/components/spinner";
import { myRequests } from "@/server/request/my-requests";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function MyRequests() {
  const result = myRequests();
  return (
    <div className="w-full">
      <p className="text-neutral-500 text-2xl font-light">My Requests</p>
      <Suspense fallback={<Loader />}>
        <MyRequestsList requests={result} />
      </Suspense>
    </div>
  );
}

export function Loader() {
  return (
    <div className="w-full flex justify-center items-center my-6">
      <Spinner />
    </div>
  );
}
