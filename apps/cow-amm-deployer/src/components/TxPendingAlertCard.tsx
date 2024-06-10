import { AlertCard } from "./AlertCard";

export function TxPendingAlertCard() {
  return (
    <div className="bg-foreground text-background mb-2">
      <AlertCard style="warning" title="CoW AMM Transaction pending">
        <p>
          There is a pending transaction related to the CoW AMM. Please take
          care staking multiple CoW AMM actions since they can interfere with
          each other.
        </p>
      </AlertCard>
    </div>
  );
}
