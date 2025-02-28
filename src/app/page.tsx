"use client";
import { ContractForm, Navbar, PlacementsChart } from "@/components";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto p-8 bg-background rounded-lg">
        <Suspense fallback={<MainContentFallback />}>
          <MainContent />
        </Suspense>
      </main>
    </>
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
  const [coords, setCoords] = useState<[number, number][]>([]);
  const params = useSearchParams();
  const clientName = params.get("c") ?? "your company";

  useEffect(() => calculateCoords(params.entries().toArray()), []);

  function calculateCoords(entries: [string, string][]) {
    const data = Object.fromEntries(entries);
    if (
      !data.h ||
      !data.b ||
      !data.d ||
      !data.r ||
      !data.g ||
      !data.i ||
      !data.a ||
      !data.cc ||
      !data.p ||
      !data.f
    ) {
      return;
    }
    setCoords(
      [...Array(parseInt(data.h)).keys()].map((i) => {
        const placements = i + 1;
        const baseFeePerPlacement = parseFloat(data.b);
        const firstHireDiscount = parseFloat(data.d);
        const retainerFee = parseFloat(data.r);
        const guaranteeCost = parseFloat(data.g);
        const installmentDiscount = parseFloat(data.i);
        const advancePaymentBonus = parseFloat(data.a);
        const creditCardFees = parseFloat(data.cc);
        const replacementProbability = parseFloat(data.p);
        const feeReductionPerReplacement = parseFloat(data.f);
        let price =
          placements * baseFeePerPlacement * (1 - firstHireDiscount) +
          advancePaymentBonus +
          retainerFee -
          guaranteeCost -
          replacementProbability *
            baseFeePerPlacement *
            feeReductionPerReplacement;
        price -= installmentDiscount * price;
        price -= creditCardFees * price;
        price = parseFloat(price.toFixed(2));
        return [placements, price];
      })
    );
  }

  function onFormInput(event: FormEvent) {
    const form = event.currentTarget as HTMLFormElement;
    calculateCoords(
      new FormData(form)
        .entries()
        .toArray()
        .map(([k, v]) => [k.toString(), v.toString()])
    );
  }

  return (
    <>
      <h1 className="text-5xl text-center font-bold mb-4 text-foreground">
        {!params.toString()
          ? "Contract Negotiation Tool"
          : `Contract offers for ${clientName}`}
      </h1>
      <PlacementsChart coords={coords} />
      <ContractForm onInput={onFormInput} />
    </>
  );
}
