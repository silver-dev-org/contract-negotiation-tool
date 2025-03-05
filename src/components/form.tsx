import { ContractProps } from "@/app/utils";
import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";

export function Form({
  onValuesChange: onValuesChange,
}: {
  onValuesChange?: (data: ContractProps) => void;
}) {
  const [f, setF] = useState<number>();
  const [n, setN] = useState<number>();

  useEffect(() => {
    if (!n || n < 1 || !f || !onValuesChange) return;
    onValuesChange({
      numberOfPlacements: n,
      basePlacementFee: f,
    });
  }, [n, f]);

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
        <div className="flex flex-col">
          <label className="me-2" htmlFor="n">
            Number of placements:
          </label>
          <input
            className="border rounded bg-transparent text-foreground p-2"
            type="number"
            id="n"
            name="n"
            placeholder="Enter a number"
            min={1}
            max={100}
            onChange={(e) => setN(parseInt(e.target.value) || undefined)}
          />
        </div>
        <div className="flex flex-col">
          <label className="me-2" htmlFor="f">
            Base placement fee:
          </label>
          <CurrencyInput
            className="border rounded bg-transparent text-foreground p-2"
            id="f"
            name="f"
            placeholder="Enter a number"
            decimalsLimit={2}
            prefix="$"
            onValueChange={(value, name, values) => {
              if (!values) return;
              if (!values.float) return;
              setF(values.float);
            }}
          />
        </div>
        <fieldset className="p-2 border flex flex-col rounded">
          <legend>Payment method</legend>
          <div>
            <input
              className="border rounded bg-transparent text-foreground"
              type="checkbox"
              id="cc"
              name="cc"
            />
            <label className="ms-2" htmlFor="cc">
              Credit card
            </label>
          </div>
        </fieldset>
      </div>
      <a
        className="block text-center uppercase border rounded bg-primary hover:bg-primary/90 text-white border-white font-semibold p-2 mt-4 disabled:bg-neutral-500 disabled:bg-foreground-diminished"
        href="mailto:gabriel@silver.dev?subject=Email Subject&body=Contents of email"
        role="button"
      >
        Share with Gabriel
      </a>
    </form>
  );
}
