"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { chartInfo } from "@/server/user/profile";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  donated: {
    label: "Donated",
    color: "var(--chart-1)",
  },
  requested: {
    label: "Requested",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartComponent() {
  const query = useQuery({
    queryKey: ["chart"],
    queryFn: async () => {
      const result = await chartInfo();
      return result;
    },
  });
  const chartData = [
    {
      donated: query.data?.totalDonations ?? 0,
      requested: query.data?.totalRequests ?? 0,
    },
  ];

  return (
    <div>
      <div>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto size-[200px] scale-75"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={250}
            innerRadius={80}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />

            {/* Radial bars for each data key */}
            <RadialBar
              dataKey="donated"
              stackId="a"
              cornerRadius={10}
              fill="var(--chart-1)"
            />
            <RadialBar
              dataKey="requested"
              stackId="a"
              cornerRadius={10}
              fill="var(--chart-2)"
            />

            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="text-4xl font-normal fill-neutral-600"
                        >
                          {query.data?.totalLivesAffected}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-neutral-500 font-light"
                        >
                          Lives Affected
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </div>
      <div className="flex justify-center items-center gap-x-16">
        <div className="flex flex-col justify-center items-end flex-1">
          <div className="flex flex-col justify-center items-center gap-y-2">
            {query.isLoading ? (
              <Skeleton className="w-[30px] h-2" />
            ) : (
              <p className="text-sm text-neutral-500 font-light">
                {query.data?.totalDonations} Units
              </p>
            )}
            <div className="flex justify-center items-center gap-x-2">
              <p className="text-xs font-extralight text-neutral-400">
                Donated
              </p>
              <div className="h-3 w-3 rounded bg-[var(--chart-1)]" />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-start flex-1">
          <div className="flex flex-col justify-center items-center gap-y-2">
            {query.isLoading ? (
              <Skeleton className="w-[30px] h-2" />
            ) : (
              <p className="text-sm text-neutral-500 font-light">
                {query.data?.totalRequests} Units
              </p>
            )}
            <div className="flex justify-center items-center gap-x-2">
              <div className="h-3 w-3 rounded bg-[var(--chart-2)]" />
              <p className="text-xs font-extralight text-neutral-400">
                Requested
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
