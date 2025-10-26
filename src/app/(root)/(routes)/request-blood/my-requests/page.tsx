import { MyRequestsList } from "@/components/modules/request/my-requests";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function MyRequests() {
  return (
    <div className="w-full">
      <p className="text-neutral-500 text-2xl font-light">My Requests</p>
      <div className="pb-4">
        <MyRequestsList />
      </div>
    </div>
  );
}
