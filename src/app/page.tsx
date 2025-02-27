"use client";
import { ContractForm, Navbar, PlacementsChart } from "@/components";
import { FormEvent, useCallback, useEffect, useState } from "react";

export default function Home() {
  const [shouldContractShowForm, setShouldShowContractForm] =
    useState<boolean>(false);
  const xs: number[] = [...Array(10).keys()].map((i) => i + 1);
  const [ys, setYs] = useState<number[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldContractShowForm = params.toString().length === 0;
    setShouldShowContractForm(shouldContractShowForm);
    if (!shouldContractShowForm) {
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
        !data.baseFee ||
        !data.firstHireDiscount ||
        !data.retainerFee ||
        !data.guaranteeCost ||
        !data.installmentDiscount ||
        !data.advancePaymentBonus ||
        !data.creditCardFees ||
        !data.replacementProbability ||
        !data.feeReduction
      ) {
        return false;
      }
      setYs(
        xs.map((placements) => {
          const baseFee = parseFloat(data.baseFee);
          const firstHireDiscount = parseFloat(data.firstHireDiscount);
          const retainerFee = parseFloat(data.retainerFee);
          const guaranteeCost = parseFloat(data.guaranteeCost);
          const installmentDiscount = parseFloat(data.installmentDiscount);
          const advancePaymentBonus = parseFloat(data.advancePaymentBonus);
          const creditCardFees = parseFloat(data.creditCardFees);
          const replacementProbability = parseFloat(
            data.replacementProbability
          );
          const feeReduction = parseFloat(data.feeReduction);

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
          Contract Negotiation Tool
        </h1>
        <PlacementsChart xs={xs} ys={ys} />
        {shouldContractShowForm && <ContractForm onInput={onFormInput} />}
      </main>
    </>
  );
}
