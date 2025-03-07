import { ContractProps } from "@/app/utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";

export function Form({
  onValuesChange,
}: {
  onValuesChange: (formState: ContractProps) => void;
}) {
  const searchParams = useSearchParams();
  function getParam(key: string, defaultValue: any) {
    const param = searchParams.get(key);
    if (param === null) return defaultValue;
    if (param === "true") return true;
    return Number(param);
  }

  const [formState, setFormState] = useState<ContractProps>({
    n: getParam("n", 1),
    f: getParam("f", 20),
    s: getParam("s", 0),
    h: getParam("h", false),
    x: getParam("x", false),
    p: getParam("p", false),
    d: getParam("d", false),
    g: getParam("g", false),
  });

  function updateFormStateValue(key: string, value: any) {
    setFormState((previousFormState) => ({
      ...previousFormState,
      [key]: value,
    }));
  }

  useEffect(() => onValuesChange(formState), [formState]);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
        <section className="border rounded p-4 flex flex-col gap-2 border-neutral-500">
          <h1 className="text-xl">Placement fee</h1>
          <strong className="text-4xl ">{formState.f}%</strong>
        </section>
        <div className="flex flex-col gap-4">
          <NumericInput
            id="n"
            defaultValue={formState.n}
            onInput={updateFormStateValue}
            label="Number of placements"
          />
          <NumericInput
            id="s"
            defaultValue={formState.s}
            onInput={updateFormStateValue}
            label="Expected Average Salary"
            type="money"
          />
        </div>
        {[
          ["x", "Exclusivity", "Each role is handled by only one agency."],
          ["p", "Payroll", "Delegate wages management."],
          ["d", "Deferred payment", "Pay 6 months after the hire was made."],
          ["g", "Pay as you go", "Pay in 3 months instead of all at once."],
        ].map(([key, label, description]) => {
          return (
            <label
              className="flex flex-col border rounded p-2 border-neutral-500 cursor-pointer"
              key={key}
            >
              <div className="flex align-middle gap-2">
                <input
                  type="checkbox"
                  name={key}
                  id={key}
                  onChange={(e) => updateFormStateValue(key, e.target.checked)}
                  checked={formState[key as keyof ContractProps]}
                />
                <span className="text-lg">{label}</span>
              </div>
              <p className="text-gray-400 text-sm">{description}</p>
            </label>
          );
        })}
      </div>
      <button
        type="button"
        className="w-full text-center uppercase border rounded bg-primary hover:bg-primary/90 text-white border-white font-semibold p-2"
        onClick={() => {
          const queryString = Object.entries(formState)
            .filter(([key, value]) => value)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");
          const contractUrl = `${window.location.origin}?${queryString}`;
          const emailBody = `View the updated contract details here: ${contractUrl}`;
          const mailtoLink = `mailto:gabriel@silver.dev?subject=Contract Details&body=${encodeURIComponent(
            emailBody
          )}`;
          const newTab = window.open(contractUrl, "_blank");
          if (newTab) newTab.focus();
          setTimeout(() => (window.location.href = mailtoLink), 500);
        }}
      >
        Share with Gabriel
      </button>
    </form>
  );
}

function NumericInput({
  id,
  label,
  defaultValue,
  type,
  onInput,
}: {
  id: string;
  label: string;
  onInput: (id: string, value: number) => void;
  defaultValue?: number;
  type?: "money" | "percentage";
}) {
  let prefix: string | undefined;
  let suffix: string | undefined;
  switch (type) {
    case "money":
      prefix = "$";
      break;
    case "percentage":
      suffix = "%";
    default:
      break;
  }
  return (
    <div className="flex flex-col">
      <label className="me-2 text-lg" htmlFor={id}>
        {label}:
      </label>
      <CurrencyInput
        className="border rounded bg-transparent text-foreground p-2 border-neutral-500"
        id={id}
        name={id}
        placeholder="Enter a number"
        prefix={prefix}
        suffix={suffix}
        min={1}
        decimalsLimit={2}
        allowNegativeValue={false}
        defaultValue={defaultValue}
        onValueChange={(value, _, values) => onInput(id, values?.float || 0)}
      />
    </div>
  );
}
