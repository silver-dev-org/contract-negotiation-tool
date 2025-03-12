"use client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import NumberFlow from "@number-flow/react";
import Image from "next/image";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import SilverLogoWhite from "../../public/silver-logo-white.svg";

import { Form } from "@/components";
import { Suspense, useState } from "react";
import { calculateContractCost, ContractProps, payrollCost } from "./utils";

export default function Page() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [cost, setCost] = useState<number>();

  function processFormData(data: ContractProps) {
    const startingMonth = data.d ? 6 : 3;
    const chartData = [];
    const yAxis = 1000 + calculateContractCost(data, false, false);
    for (let monthNum = 1; monthNum <= 12; monthNum++) {
      const month = new Date();
      month.setMonth(month.getMonth() + monthNum);
      const fee =
        monthNum == startingMonth ||
        (data.g && monthNum >= startingMonth && monthNum < startingMonth + 3)
          ? Math.round(calculateContractCost(data, false) / (data.g ? 3 : 1))
          : 0;
      const payroll = data.p ? payrollCost : 0;
      chartData.push({
        month: month.toLocaleString("default", { month: "long" }),
        fee: fee,
        payroll: payroll,
        yAxis: yAxis,
      });
    }
    setChartData(chartData);
    setCost(calculateContractCost(data));
  }

  function formatMoney(n: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="text-foreground font-serif flex justify-between items-center p-4 border-b">
        <a href="https://silver.dev" target="_blank">
          <Image width={200} src={SilverLogoWhite} alt="Silver.dev" />
        </a>
      </header>
      <div className="flex flex-col xl:flex-row gap-12 p-12 container mx-auto flex-grow">
        <Suspense>
          <Form onValuesChange={processFormData} />
        </Suspense>
        <div className="flex flex-col flex-grow">
          <div className="font-serif flex flex-col justify-center">
            <p className="italic">Expected contract cost:</p>
            <p className="text-primary font-extralight text-6xl sm:text-8xl mt-6 mb-6">
              <NumberFlow prefix="$" value={cost || 0} />
            </p>
          </div>
          <ChartContainer
            // config={{}}
            config={{
              fee: {
                label: "Fee",
              },
              payroll: {
                label: "Payroll",
              },
            }}
            className="w-full min-h-80"
          >
            <BarChart accessibilityLayer data={chartData}>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="payroll" fill="silver" stackId={1} />
              <Bar dataKey="fee" fill="white" stackId={1} />
              <CartesianGrid vertical={false} />
              <YAxis
                dataKey="yAxis"
                tickFormatter={formatMoney}
                tickLine={false}
              />
              <XAxis
                dataKey="month"
                tickFormatter={(month) => month.slice(0, 3)}
                tickMargin={12}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
