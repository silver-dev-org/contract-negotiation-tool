"use client";
import { ContractForm, Navbar, PlacementsChart } from "@/components";
import { FormEvent, useCallback, useEffect, useState } from "react";

export default function Home() {
  const [shouldContractShowForm, setShouldShowContractForm] =
    useState<boolean>(false);
  const xs: number[] = [...Array(10).keys()].map((i) => i + 1);
  const [ys, setYs] = useState<number[]>([]);
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldContractShowForm = params.toString().length === 0;
    setShouldShowContractForm(shouldContractShowForm);
    if (!shouldContractShowForm) {
      setClientName(params.get("c") ?? "your company");
      const chartWasUpdated = calculatePrices(params.entries().toArray());
      if (!chartWasUpdated) {
        alert("There are missing fields.");
      }
    }
  }, []);

  const calculatePrices = useCallback(
    (entries: [string, string][]): boolean => {
      const data = Object.fromEntries(entries);
      if (
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
      setYs(
        xs.map((placements) => {
          const baseFee = parseFloat(data.b);
          const firstHireDiscount = parseFloat(data.d);
          const retainerFee = parseFloat(data.r);
          const guaranteeCost = parseFloat(data.g);
          const installmentDiscount = parseFloat(data.i);
          const advancePaymentBonus = parseFloat(data.a);
          const creditCardFees = parseFloat(data.cc);
          const replacementProbability = parseFloat(data.p);
          const feeReduction = parseFloat(data.f);

          let value =
            placements * baseFee * (1 - firstHireDiscount) +
            retainerFee -
            replacementProbability * feeReduction -
            guaranteeCost +
            advancePaymentBonus;

          value = value - installmentDiscount * value - creditCardFees * value;
          return Math.round(value);
        })
      );
      return true;
    },
    [xs]
  );

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
