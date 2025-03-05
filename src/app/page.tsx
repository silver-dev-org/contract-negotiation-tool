"use client";
import { Chart, Footer, Form } from "@/components";
import { Suspense, useState } from "react";
import { calculateContractValue } from "./utils";

export default function Page() {
  return (
    <div className="flex flex-col h-screen">
      <main className="p-4 flex-grow">
        <Suspense fallback={<MainContentFallback />}>
          <MainContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function MainContentFallback() {
  return (
    <h1 className="text-5xl text-center font-bold mb-4 text-foreground">
      Loading...
    </h1>
  );
}

function MainContent() {
  const [xValues, setXValues] = useState<number[]>([]);
  const [yValues, setYValues] = useState<number[]>([]);
  const [expectedContractValue, setExpectedContractValue] = useState<number>();

  return (
    <>
      <h1 className="text-2xl sm:text-4xl text-center font-bold mb-4 text-foreground p-4 font-serif">
        Contract Negotiation Tool
      </h1>
      <div className="flex gap-2 flex-col xl:flex-row">
        <div className="flex-grow">
          {expectedContractValue && (
            <p className="text-3xl mt-4 mb-6">
              Expected contract value:{" "}
              <span className="text-primary font-serif font-extralight">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(expectedContractValue)}
              </span>
            </p>
          )}
          <Chart xValues={xValues} yValues={yValues} />
        </div>
        <div className="order-first">
          <Form
            onValuesChange={(data) => {
              const xs = [];
              const ys = [];
              for (let x = 0; x <= data.numberOfPlacements; x++) {
                xs.push(x);
                ys.push(
                  calculateContractValue({ ...data, numberOfPlacements: x })
                );
              }
              setXValues(xs);
              setYValues(ys);
              setExpectedContractValue(calculateContractValue(data));
            }}
          />
        </div>
      </div>
    </>
  );
}
