import { RequestsList } from "@/components/modules/request/requests-list";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { fetchRequests } from "@/server/request/fetch-requests";
import { Droplet, User } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function RequestBlood() {
  const requests = fetchRequests();
  return (
    <div>
      <p className="text-neutral-500 text-2xl font-light">All Blood Requests</p>
      <div className="my-4 flex justify-start items-center gap-x-4">
        <Button asChild variant="secondary">
          <Link
            href="/request-blood/new"
            className="flex justify-center items-center gap-x-2"
          >
            <span>New Request</span>
            <Droplet />
          </Link>
        </Button>
        <Button asChild variant="tertiary">
          <Link
            href="/request-blood/my-requests"
            className="flex justify-center items-center gap-x-2"
          >
            <span>My Requests</span>
            <User />
          </Link>
        </Button>
      </div>
      <Suspense
        fallback={
          <div className="w-full flex justify-center my-6">
            <Spinner />
          </div>
        }
      >
        <RequestsList requests={requests} />
      </Suspense>
    </div>
  );
}
