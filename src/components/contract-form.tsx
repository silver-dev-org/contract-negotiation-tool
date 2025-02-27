import { FormHTMLAttributes, InputHTMLAttributes } from "react";

export function ContractForm({
  ...props
}: FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form id="form" className="space-y-4 mt-8" {...props}>
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
            min="0"
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
            min="0"
            placeholder="e.g., 0.1 for 10%"
          />
          <InputField
            label="Installment Discount Factor:"
            name="installmentDiscount"
            step="0.01"
            min="0"
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
            min="0"
            max="1"
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
    <fieldset className="flex-grow">
      <legend className="text-xl font-semibold">{legend}</legend>
      <div className="space-y-2 mt-2">{children}</div>
    </fieldset>
  );
}
