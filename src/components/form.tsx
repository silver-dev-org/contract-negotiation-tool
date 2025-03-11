import { ContractProps } from "@/app/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { Input } from "./ui/input";

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
    s: getParam("s", 75000),
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
    <div className="flex flex-col gap-6 text-nowrap sm:min-w-fit">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{formState.f}%</CardTitle>
          <CardDescription>Placement fee</CardDescription>
        </CardHeader>
      </Card>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="numberOfPlacementsInput">Number of placements:</Label>
        <Input
          id="numberOfPlacementsInput"
          type="number"
          min={1}
          step={1}
          defaultValue={formState.n}
          onInput={(e) => updateFormStateValue("n", e.currentTarget.value)}
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="expectedAverageSalaryInput">
          Expected Average Salary:
        </Label>
        <CurrencyInput
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          )}
          id="expectedAverageSalaryInput"
          placeholder="Enter a number"
          prefix="$"
          decimalsLimit={2}
          allowNegativeValue={false}
          defaultValue={formState.s}
          onValueChange={(value, _, values) =>
            updateFormStateValue("s", values?.float || 0)
          }
        />
      </div>
      {[
        ["x", "Exclusivity", "Each role is handled by only one agency."],
        ["p", "Payroll", "Delegate wages management."],
        ["d", "Deferred payment", "Pay 6 months after the hire was made."],
        ["g", "Pay as you go", "Pay in 3 months instead of all at once."],
      ].map(([key, label, description]) => {
        return (
          <div key={key} className="items-top flex space-x-2">
            <Checkbox
              id={key}
              onCheckedChange={(checked) => updateFormStateValue(key, checked)}
              checked={formState[key as keyof ContractProps]}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor={key}>{label}</Label>
              <p className="text-sm text-muted-foreground text-wrap">
                {description}
              </p>
            </div>
          </div>
        );
      })}
      <Button
        type="button"
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
      </Button>
    </div>
  );
}
