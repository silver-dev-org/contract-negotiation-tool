export const payrollCost = 300;

export interface ContractProps {
  n: number;
  f: number;
  s: number;
  h: boolean;
  x: boolean;
  p: boolean;
  d: boolean;
  g: boolean;
  t: boolean;
  [key: string]: any;
}

export function calculateContractCost(
  data: ContractProps,
  includePayroll: boolean = true,
  includeDiscounts: boolean = true
) {
  let value = data.n * (data.f / 100) * data.s;
  if (data.p && includePayroll) {
    value += payrollCost * 12;
  }
  if (!data.d && includeDiscounts) {
    if (data.h || data.n >= 3) {
      value -= value * 0.25;
    } else if (data.x || data.t) {
      value -= value * 0.15;
    }
  }
  return value;
}
