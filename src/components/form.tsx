import { ContractProps } from "@/app/utils";
import { useState } from "react";
import CurrencyInput from "react-currency-input-field";

export function Form({
  onValuesChange: onValuesChange,
}: {
  onValuesChange?: (data: ContractProps) => void;
}) {
  const [f, setF] = useState<number>();

  return (
    <form
      className="bg-background-highlighted rounded p-4 shadow-md"
      onSubmit={(e) => e.preventDefault()}
      onInput={(event) => {
        const rawData = new FormData(event.currentTarget);
        const n = rawData.get("n")?.toString();
        if (!n || !f || !onValuesChange) {
          return;
        }
        const data: ContractProps = {
          numberOfPlacements: parseInt(n),
          basePlacementFee: f,
        };
        if (data.numberOfPlacements < 1) {
          return;
        }
        onValuesChange(data);
      }}
    >
      <div className="gap-3 grid grid-cols-2 sm:grid-cols-3">
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
      <button
        className="uppercase border rounded w-full bg-primary hover:bg-primary/90 text-white border-white font-semibold p-2 mt-4 disabled:text-background-highlighted disabled:bg-foreground-diminished"
        type="button"
        onClick={(event) => {
          window.navigator.clipboard.writeText(window.location.hostname);
          const button = event.target as HTMLButtonElement;
          const originalText = button.innerText;
          button.innerText = "Copied!";
          button.disabled = true;
          setTimeout(() => {
            button.innerText = originalText;
            button.disabled = false;
          }, 2000);
        }}
      >
        Share
      </button>
    </form>
  );
}
