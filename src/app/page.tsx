"use client";

import Image from "next/image";
import SilverLogoWhite from "../../public/silver-logo-white.svg";

import { Chart, Form } from "@/components";
import { Suspense, useState } from "react";
import { calculateContractValue, payrollCost } from "./utils";

export default function Page() {
  const [fees, setFees] = useState<number[]>([]);
  const [expectedContractValue, setExpectedContractValue] = useState<number>();
  const [
    expectedContractValueWithoutDiscounts,
    setExpectedContractValueWithoutDiscounts,
  ] = useState<number>();

  return (
    <div className="flex flex-col xl:gap-16 h-screen">
      <header className="text-foreground font-serif flex justify-between container mx-auto items-center p-4">
        <a href="https://silver.dev" target="_blank">
          <Image width={200} src={SilverLogoWhite} alt="Silver.dev" />
        </a>
      </header>
      <div className="flex flex-col xl:flex-row gap-8 container mx-auto p-8 flex-grow">
        <Suspense>
          <Form
            onValuesChange={(data) => {
              const expectedContractValue = calculateContractValue(true, data);
              const fees = [];
              const startingMonth = data.d ? 6 : 3;
              let fee = 0;
              for (let month = 1; month <= 12; month++) {
                if (data.p) {
                  fee += payrollCost;
                }
                if (
                  month == startingMonth ||
                  (data.g &&
                    month >= startingMonth &&
                    month < startingMonth + 3)
                ) {
                  fee += expectedContractValue / (data.g ? 3 : 1);
                }
                fees.push(fee);
              }
              setFees(fees);
              setExpectedContractValueWithoutDiscounts(
                calculateContractValue(false, data)
              );
              setExpectedContractValue(expectedContractValue);
            }}
          />
        </Suspense>
        <div className="flex flex-col gap-4 flex-grow xl:w-1/2">
          <dl className="font-serif flex flex-col justify-center">
            <dt className="text-lg italic mb-4">Expected contract value: </dt>
            <dd className="flex flex-col gap-2">
              {expectedContractValue != expectedContractValueWithoutDiscounts &&
                expectedContractValueWithoutDiscounts && (
                  <span className="line-through text-gray-500 text-4xl">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(expectedContractValueWithoutDiscounts)}
                  </span>
                )}
              <span className="text-primary font-extralight text-6xl sm:text-8xl">
                {expectedContractValue
                  ? new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(expectedContractValue)
                  : "-"}
              </span>
            </dd>
          </dl>
          <Chart fees={fees} />
        </div>
      </div>
    </div>
  );
}
