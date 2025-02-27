"use client";
import { ContractForm, Navbar, PlacementsChart } from "@/components";
import { FormEvent, useEffect, useState } from "react";

export default function Home() {
  const [shouldContractShowForm, setShouldShowContractForm] =
    useState<boolean>(false);
  const [xs, setXs] = useState<number[]>([]);
  const [ys, setYs] = useState<number[]>([]);
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldContractShowForm = params.toString().length === 0;
    setShouldShowContractForm(shouldContractShowForm);
    if (!shouldContractShowForm) {
      setClientName(params.get("c") ?? "your company");
      const couldCalculate = calculatePrices(params.entries().toArray());
      if (!couldCalculate) {
        alert("There are missing fields.");
      }
    }
  }, []);

  function calculatePrices(entries: [string, string][]): boolean {
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
      return false;
    }
    const xs = [...Array(parseInt(data.h)).keys()].map((i) => i + 1);
    setXs(xs);
    setYs(
      xs.map((placements) => {
        const baseFeePerPlacement = parseFloat(data.b);
        const firstHireDiscount = parseFloat(data.d);
        const retainerFee = parseFloat(data.r);
        const guaranteeCost = parseFloat(data.g);
        const installmentDiscount = parseFloat(data.i);
        const advancePaymentBonus = parseFloat(data.a);
        const creditCardFees = parseFloat(data.cc);
        const replacementProbability = parseFloat(data.p);
        const feeReductionPerReplacement = parseFloat(data.f);

        let value =
          placements * baseFeePerPlacement * (1 - firstHireDiscount) +
          advancePaymentBonus +
          retainerFee -
          guaranteeCost -
          replacementProbability *
            baseFeePerPlacement *
            feeReductionPerReplacement;
        value -= installmentDiscount * value;
        value -= creditCardFees * value;
        return Math.round(value);
      })
    );
    return true;
  }

  function onFormInput(event: FormEvent) {
    const form = event.currentTarget as HTMLFormElement;
    calculatePrices(
      new FormData(form)
        .entries()
        .toArray()
        .map(([k, v]) => [k.toString(), v.toString()])
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto p-8 bg-background rounded-lg">
        <h1 className="text-5xl text-center font-bold mb-4 text-foreground">
          {shouldContractShowForm
            ? "Contract Negotiation Tool"
            : `Contract offers for ${clientName}`}
        </h1>
        <PlacementsChart xs={xs} ys={ys} />
        {shouldContractShowForm && <ContractForm onInput={onFormInput} />}
      </main>
    </>
  );
}
