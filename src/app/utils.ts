export interface ContractProps {
  numberOfPlacements: number;
  basePlacementFee: number;
  clientName?: string;
}
export function calculateContractValue({ ...props }: ContractProps) {
  return props.numberOfPlacements * props.basePlacementFee;
}
