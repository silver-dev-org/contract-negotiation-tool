"use client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import NumberFlow from "@number-flow/react";
import Image from "next/image";

import { ContractProps } from "@/app/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { scaleLog } from "d3-scale";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import SilverLogoWhite from "../../public/silver-logo-white.svg";

import { calculateContractCost, payrollCost } from "./utils";
const scale = scaleLog().base(Math.E);

export default function Page() {
  const searchParams = useSearchParams();
  const [chartData, setChartData] = useState<any[]>([]);
  const [cost, setCost] = useState<number>();
  const [shareLink, setShareLink] = useState("");
  const [contractProps, setContractProps] = useState<ContractProps>({
    n: getParam("n", 1),
    f: getParam("f", 20),
    s: getParam("s", 75000),
    h: getParam("h", false),
    x: getParam("x", false),
    p: getParam("p", false),
    d: getParam("d", false),
    g: getParam("g", false),
    t: getParam("t", false),
  });
  function getParam(key: string, defaultValue: any) {
    const param = searchParams.get(key);
    if (param === null) return defaultValue;
    if (param === "true") return true;
    return Number(param);
  }

  useEffect(() => processContractProps(contractProps), [contractProps]);

  function processContractProps(props: ContractProps) {
    const startingMonth = props.d ? 6 : 3;
    const chartData = [];
    const yAxis = 1000 + calculateContractCost(props, false, false);
    for (let monthNum = 1; monthNum <= 12; monthNum++) {
      const month = new Date();
      month.setMonth(month.getMonth() + monthNum);
      const fee =
        monthNum == startingMonth ||
        (props.g && monthNum >= startingMonth && monthNum < startingMonth + 3)
          ? Math.round(calculateContractCost(props, false) / (props.g ? 3 : 1))
          : 0;
      const payroll = props.p ? payrollCost : 0;
      chartData.push({
        month: month.toLocaleString("default", { month: "long" }),
        fee: fee,
        payroll: payroll,
        yAxis: yAxis,
      });
    }
    setChartData(chartData);
    setCost(calculateContractCost(props));
  }

  function setContractProp(key: string, value: any) {
    setContractProps((params) => ({
      ...params,
      [key]: value,
    }));
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="text-foreground font-serif flex justify-between items-center p-4 border-b">
        <a href="https://silver.dev" target="_blank">
          <Image width={200} src={SilverLogoWhite} alt="Silver.dev" />
        </a>
      </header>
      <div className="flex flex-col xl:flex-row gap-12 p-12 container mx-auto flex-grow">
        <div className="flex flex-col gap-4 sm:max-w-xs">
          <div className="flex flex-col  gap-1.5">
            <Label htmlFor="numberOfPlacementsInput">
              Number of placements:
            </Label>
            <Input
              id="numberOfPlacementsInput"
              type="number"
              min={1}
              step={1}
              defaultValue={contractProps.n}
              onInput={(e) => setContractProp("n", e.currentTarget.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="expectedAverageSalaryInput">
              Expected Average Salary:
            </Label>
            <CurrencyInput
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              )}
              id="expectedAverageSalaryInput"
              placeholder="Enter a number"
              prefix="$"
              decimalsLimit={2}
              allowNegativeValue={false}
              defaultValue={contractProps.s}
              onValueChange={(value, _, values) =>
                setContractProp("s", values?.float || 0)
              }
            />
          </div>
          {[
            ["x", "Exclusivity", "Each role is handled by only one agency."],
            ["p", "Payroll", "Delegate wages management."],
            ["d", "Deferred payment", "Pay 6 months after the hire was made."],
            ["g", "Pay as you go", "Pay in 3 months instead of all at once."],
            [
              "t",
              "Strong guarantee",
              "No fee will be due until the guarantee period (90 calendar days) is over.",
            ],
          ].map(([key, label, description]) => {
            return (
              <Label key={key} htmlFor={key}>
                <Card
                  className={`transition-colors hover:bg-primary/10 cursor-pointer ${
                    contractProps[key as keyof ContractProps] &&
                    "border-primary"
                  }`}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="flex gap-1.5">
                      <Checkbox
                        id={key}
                        onCheckedChange={(checked) =>
                          setContractProp(key, checked)
                        }
                        checked={contractProps[key as keyof ContractProps]}
                      />
                      {label}
                    </CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              </Label>
            );
          })}
          <Button
            asChild
            className="bg-gradient-to-br from-zinc-500 via-zinc-50 to-zinc-500 duration-300 transition-all hover:opacity-50"
            onClick={() => {
              const queryString = Object.entries(contractProps)
                .filter(([key, value]) => value)
                .map(([key, value]) => `${key}=${value}`)
                .join("&");
              const emailSubject = encodeURIComponent("Contract Details");
              const emailBody = encodeURIComponent(
                `View the updated contract details here: ${window.location.origin}?${queryString}.`
              );
              const shareLink = `mailto:gabriel@silver.dev?subject=${emailSubject}&body=${emailBody}`;
              setShareLink(shareLink);
            }}
          >
            <Link target="_blank" href={shareLink}>
              Share with Gabriel
            </Link>
          </Button>
        </div>
        <div className="flex flex-col flex-grow">
          <div className="flex gap-3 mb-12">
            <Card className="w-1/2 text-center">
              <CardHeader className="h-full">
                <CardTitle className="text-6xl my-auto font-serif">
                  <NumberFlow prefix="$" value={cost || 0} />
                </CardTitle>
                <CardDescription>Expected contract cost</CardDescription>
              </CardHeader>
            </Card>
            <Card className="w-1/2 text-center">
              <CardHeader className="h-full">
                <CardTitle className="text-6xl my-auto font-serif">
                  {contractProps.f}%
                </CardTitle>
                <CardDescription>Placement fee</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <ChartContainer
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
              <Bar dataKey="payroll" fill="#fa4529" stackId={1} />
              <Bar dataKey="fee" fill="white" stackId={1} />
              <YAxis
                tickLine={false}
                orientation="right"
                dataKey="yAxis"
                tickFormatter={
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format
                }
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
