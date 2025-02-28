import { useSearchParams } from "next/navigation";
import { FormHTMLAttributes, InputHTMLAttributes } from "react";

export function ContractForm({
  ...props
}: FormHTMLAttributes<HTMLFormElement>) {
  const data = Object.fromEntries(useSearchParams().entries());
  return (
    <form id="form" className="space-y-4" {...props}>
      <div className="flex flex-col lg:flex-row lg:space-x-4 mb-4">
        <Fieldset legend="Fees">
          <InputField
            label="Base Fee per Successful Placement:"
            name="b"
            step="0.01"
            placeholder="e.g., 10000 for $10,000"
            defaultValue={data.b}
          />
          <InputField
            label="Credit Card Processing Fees:"
            name="cc"
            step="0.01"
            min="0"
            placeholder="e.g., 0.03 for 3%"
            defaultValue={data.cc}
          />
          <InputField
            label="Retainer Fee:"
            name="r"
            step="0.01"
            placeholder="e.g., 1500 for $1,500"
            defaultValue={data.r}
          />
          <InputField
            label="Fee Reduction per Replacement:"
            name="f"
            step="0.01"
            min="0"
            max="1"
            placeholder="e.g., 0.5 for 50%"
            defaultValue={data.f}
          />
        </Fieldset>
        <Fieldset legend="Financials">
          <InputField
            label="First Hire Discount:"
            name="d"
            step="0.01"
            min="0"
            placeholder="e.g., 0.1 for 10%"
            defaultValue={data.d}
          />
          <InputField
            label="Installment Discount:"
            name="i"
            step="0.01"
            min="0"
            placeholder="e.g., 0.05 for 5%"
            defaultValue={data.i}
          />
          <InputField
            label="Advance Payment Bonus:"
            name="a"
            step="0.01"
            placeholder="e.g., 500 for $500"
            defaultValue={data.a}
          />
          <InputField
            label="Guarantee Cost:"
            name="g"
            step="0.01"
            placeholder="e.g., 2000 for $2,000"
            defaultValue={data.g}
          />
        </Fieldset>
        <Fieldset legend="Special Terms">
          <InputField
            label="Client name"
            name="c"
            placeholder="e.g., Ramp"
            type="text"
            defaultValue={data.c}
          />
          <InputField
            label="Probability of Candidate Replacement:"
            name="p"
            step="0.01"
            min="0"
            max="1"
            placeholder="e.g., 0.1 for 10%"
            defaultValue={data.p}
          />
          <InputField
            label="Maximum Expected Placements"
            name="h"
            min="1"
            step="1"
            placeholder="e.g., 10"
            defaultValue={data.h}
          />
        </Fieldset>
      </div>
      <button
        type="submit"
        className="w-full bg-primary text-white uppercase border border-white font-semibold py-2 rounded-sm hover:bg-primary/90"
      >
        Share Model
      </button>
    </form>
  );
}

function InputField({
  label,
  name,
  type = "number",
  ...props
}: {
  label: string;
  name: string;
  type?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
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
    <fieldset className="flex-grow mt-8">
      <legend className="text-xl font-semibold">{legend}</legend>
      <div className="space-y-2 mt-2">{children}</div>
    </fieldset>
  );
}
