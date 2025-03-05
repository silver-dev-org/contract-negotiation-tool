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

  return (
    <>
      <h1 className="text-2xl sm:text-4xl text-center font-bold mb-4 text-foreground p-4">
        Contract Negotiation Tool
      </h1>
      <div className="flex gap-2 flex-col xl:flex-row">
        <div className="flex-grow">
          <Chart xValues={xValues} yValues={yValues} />
        </div>
        <div>
          <Form
            onValuesChange={(data) => {
              const xs = [];
              const ys = [];
              const numberOfPlacements = data.numberOfPlacements;
              for (let x = 0; x <= numberOfPlacements; x++) {
                data.numberOfPlacements = x;
                const y = calculateContractValue(data);
                xs.push(x);
                ys.push(y);
              }
              setXValues(xs);
              setYValues(ys);
            }}
          />
        </div>
      </div>
    </>
  );
}
