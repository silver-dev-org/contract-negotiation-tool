"use client";
import {
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import Link from "next/link";
import React, { FormEvent, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function InputField({
  label,
  name,
  type = "number",
  ...props
}: {
  label: string;
  name: string;
  type?: string;
  [key: string]: any;
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="font-medium">
        {label}
      </label>
      <input
        type={type}
        name={name}
        className="border bg-transparent rounded-lg p-2 focus:outline-none focus:ring focus:ring-primary"
        required
        {...props}
      />
    </div>
  );
}

function Fieldset({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex-grow">
      <legend className="text-xl font-semibold">{legend}</legend>
      <div className="space-y-2 mt-2">{children}</div>
    </fieldset>
  );
}

function PlacementsChart({ xs, ys }: { xs: number[]; ys: number[] }) {
  return (
    <Line
      options={{
        responsive: true,
        interaction: {
          mode: "index",
          intersect: false,
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Placements",
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: (tooltipItems) => `${tooltipItems[0].label} placements`,
            },
          },
        },
      }}
      data={{
        labels: xs,
        datasets: [
          {
            label: "Price",
            borderColor: "#fa4529",
            data: ys,
          },
        ],
      }}
    />
  );
}

function Navbar() {
  return (
    <header className="py-4 px-6 border-b-gray-800 border-b-solid border-b-2 flex justify-center">
      <div className="container flex justify-between">
        <Link
          href="/"
          className="text-xl flex gap-2 items-center text-nowrap col-span-3"
        >
          📝 Silver Contracts
        </Link>
        <div className="hidden md:flex items-center gap-4 justify-end">
          <Link
            href="https://github.com/nicopujia/silver-contracts"
            className="flex items-center"
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 97.6 96"
              className="w-5 h-5"
            >
              <path
                fill="currentColor"
                d="M48.9,0C21.8,0,0,22,0,49.2C0,71,14,89.4,33.4,95.9c2.4,0.5,3.3-1.1,3.3-2.4c0-1.1-0.1-5.1-0.1-9.1
	c-13.6,2.9-16.4-5.9-16.4-5.9c-2.2-5.7-5.4-7.2-5.4-7.2c-4.4-3,0.3-3,0.3-3c4.9,0.3,7.5,5.1,7.5,5.1c4.4,7.5,11.4,5.4,14.2,4.1
	c0.4-3.2,1.7-5.4,3.1-6.6c-10.8-1.1-22.2-5.4-22.2-24.3c0-5.4,1.9-9.8,5-13.2c-0.5-1.2-2.2-6.3,0.5-13c0,0,4.1-1.3,13.4,5.1
	c3.9-1.1,8.1-1.6,12.2-1.6s8.3,0.6,12.2,1.6c9.3-6.4,13.4-5.1,13.4-5.1c2.7,6.8,1,11.8,0.5,13c3.2,3.4,5,7.8,5,13.2
	c0,18.9-11.4,23.1-22.3,24.3c1.8,1.5,3.3,4.5,3.3,9.1c0,6.6-0.1,11.9-0.1,13.5c0,1.3,0.9,2.9,3.3,2.4C83.6,89.4,97.6,71,97.6,49.2
	C97.7,22,75.8,0,48.9,0z"
              />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const params = new URLSearchParams(window.location.search);
  const xs: number[] = [...Array(10).keys()].map((i) => i + 1);
  const [ys, setYs] = useState<number[]>([]);

  useEffect(() => {
    if (params.toString()) {
      const wasUpdated = updatePlacementsChart(params.entries().toArray());
      if (!wasUpdated) {
        alert("There are missing fields.");
      }
    }
  }, []);

  function updatePlacementsChart(entries: [string, string][]): boolean {
    const data = Object.fromEntries(entries);
    if (
      data.baseFee === undefined ||
      data.firstHireDiscount === undefined ||
      data.retainerFee === undefined ||
      data.guaranteeCost === undefined ||
      data.installmentDiscount === undefined ||
      data.advancePaymentBonus === undefined ||
      data.creditCardFees === undefined ||
      data.replacementProbability === undefined ||
      data.feeReduction === undefined
    ) {
      return false;
    }
    setYs(
      xs.map((placements) => {
        const baseFee = parseFloat(data.baseFee.toString());
        const firstHireDiscount = parseFloat(data.firstHireDiscount.toString());
        const retainerFee = parseFloat(data.retainerFee.toString());
        const guaranteeCost = parseFloat(data.guaranteeCost.toString());
        const installmentDiscount = parseFloat(
          data.installmentDiscount.toString()
        );
        const advancePaymentBonus = parseFloat(
          data.advancePaymentBonus.toString()
        );
        const creditCardFees = parseFloat(data.creditCardFees.toString());
        const replacementProbability = parseFloat(
          data.replacementProbability.toString()
        );
        const feeReduction = parseFloat(data.feeReduction.toString());
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
  }

  function onFormInput(event: FormEvent) {
    const form = event.currentTarget as HTMLFormElement;
    updatePlacementsChart(
      new FormData(form)
        .entries()
        .toArray()
        .map((k, v) => [k.toString(), v.toString()])
    );
  }

  return (
    <>
      <Navbar></Navbar>
      <main className="max-w-5xl mx-auto p-8 bg-background rounded-lg">
        <h1 className="text-5xl text-center font-bold mb-4 text-foreground">
          Contract Negotiation Tool
        </h1>
        <PlacementsChart xs={xs} ys={ys}></PlacementsChart>
        {!params.toString() && (
          <form id="form" className="space-y-4 mt-8" onInput={onFormInput}>
            <div className="flex flex-col lg:flex-row lg:space-x-4">
              <Fieldset legend="Fees">
                <InputField
                  label="Base Fee per Successful Placement:"
                  name="baseFee"
                  step="0.01"
                  placeholder="e.g., 10000"
                />
                <InputField
                  label="Credit Card Processing Fees:"
                  name="creditCardFees"
                  step="0.01"
                  min={0}
                  placeholder="e.g., 0.03 for 3%"
                />
                <InputField
                  label="Retainer Fee:"
                  name="retainerFee"
                  step="0.01"
                  placeholder="e.g., 1500"
                />
                <InputField
                  label="Fee Reduction per Replacement:"
                  name="feeReduction"
                  step="0.01"
                  placeholder="e.g., 500"
                />
              </Fieldset>
              <Fieldset legend="Financials">
                <InputField
                  label="First Hire Discount:"
                  name="firstHireDiscount"
                  step="0.01"
                  min={0}
                  placeholder="e.g., 0.1 for 10%"
                />
                <InputField
                  label="Installment Discount Factor:"
                  name="installmentDiscount"
                  step="0.01"
                  min={0}
                  placeholder="e.g., 0.05 for 5%"
                />
                <InputField
                  label="Advance Payment Bonus:"
                  name="advancePaymentBonus"
                  step="0.01"
                  placeholder="e.g., 500"
                />
                <InputField
                  label="Guarantee Cost:"
                  name="guaranteeCost"
                  step="0.01"
                  placeholder="e.g., 2000"
                />
              </Fieldset>
              <Fieldset legend="Special Terms">
                <InputField
                  label="Probability of Candidate Replacement:"
                  name="replacementProbability"
                  step="0.01"
                  min={0}
                  max={1}
                  placeholder="e.g., 0.1 for 10%"
                />
              </Fieldset>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-semibold py-2 rounded-lg hover:bg-primary/90"
            >
              Share Model
            </button>
          </form>
        )}
      </main>
    </>
  );
}
