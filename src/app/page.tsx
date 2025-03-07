"use client";

import Image from "next/image";
import SilverLogoWhite from "../../public/silver-logo-white.svg";

import { Chart, Form } from "@/components";
import { useState } from "react";
import { calculateContractValue } from "./utils";

export default function Page() {
  const [xValues, setXValues] = useState<number[]>([]);
  const [yValues, setYValues] = useState<number[]>([]);
  const [expectedContractValue, setExpectedContractValue] = useState<number>();

  return (
    <div className="flex flex-col xl:gap-24">
      <header className="text-foreground font-serif flex justify-between container mx-auto items-center p-4">
        <a href="https://silver.dev" target="_blank">
          <Image width={200} src={SilverLogoWhite} alt="Silver.dev" />
        </a>
        <h1 className="text-xl sm:text-2xl font-bold">
          Contract Negotiation Tool
        </h1>
      </header>
      <div className="flex flex-col xl:flex-row gap-8 container mx-auto p-8">
        <div className="xl:w-1/2 xl:flex xl:justify-end">
          <Form
            onValuesChange={(data) => {
              const xs = [];
              const ys = [];
              for (let x = 0; x <= data.n; x++) {
                xs.push(x);
                ys.push(calculateContractValue({ ...data, n: x }));
              }
              setXValues(xs);
              setYValues(ys);
              setExpectedContractValue(calculateContractValue(data));
            }}
          />
        </div>
        <dl className="font-serif flex flex-col justify-center xl:w-1/2">
          <dt className="text-lg italic mb-4">Expected contract value: </dt>
          <dd className="text-primary font-extralight text-8xl">
            {expectedContractValue
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(expectedContractValue)
              : "-"}
          </dd>
        </dl>
      </div>
      <div className="container mx-auto">
        <Chart xValues={xValues} yValues={yValues} />
      </div>
    </div>
  );
}
