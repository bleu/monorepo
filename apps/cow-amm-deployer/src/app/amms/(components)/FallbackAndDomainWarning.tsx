import { AlertCard } from "#/components/AlertCard";
import { Checkbox } from "#/components/Checkbox";

export function FallbackAndDomainWarning({
  confirmedFallbackSetup,
  setConfirmedFallbackSetup,
}: {
  confirmedFallbackSetup: boolean;
  setConfirmedFallbackSetup: (value: boolean) => void;
}) {
  return (
    <AlertCard style="warning" title="Fallback Setting">
      <Checkbox
        id="set"
        checked={confirmedFallbackSetup}
        onChange={() => setConfirmedFallbackSetup(!confirmedFallbackSetup)}
        label="Approve fallback and domain verifier setup"
      />
    </AlertCard>
  );
}
