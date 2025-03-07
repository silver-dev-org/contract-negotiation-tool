export interface ContractProps {
  n: number;
  f: number;
  s: number;
  h: boolean;
  x: boolean;
  p: boolean;
  d: boolean;
  g: boolean;
  [key: string]: any;
}

export function calculateContractValue({ ...props }: ContractProps) {
  let value = props.n * (props.f / 100) * props.s;
  if (!props.d) {
    if (props.h || props.n >= 3) {
      value -= value * 0.25;
    } else if (props.x) {
      value -= value * 0.15;
    }
  }
  if (props.p) {
    value += 300 * 3;
  }
  return value;
}
