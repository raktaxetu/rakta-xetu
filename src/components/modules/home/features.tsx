import { Button } from "@/components/ui/button";
import { features } from "@/lib/constants";
import Link from "next/link";

export function Features() {
  return (
    <div className="w-full my-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 items-center gap-4">
        {features.map((feature, index) => (
          <Link
            key={index}
            className="group flex flex-col justify-center hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 rounded-lg p-4 border shadow-xs"
            href={feature.path}
          >
            <Button
              variant="secondary"
              size="icon"
              className="pointer-events-none"
            >
              <feature.icon />
            </Button>
            <div className="mt-5">
              <h3 className="group-hover:text-gray-600 text-neutral-600">
                {feature.label}
              </h3>
              <p className="mt-1 text-sm font-light text-neutral-500">{feature.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
