import { InfoCircledIcon } from "@radix-ui/react-icons";

import { AlertCard } from "#/components/AlertCard";
import { Checkbox } from "#/components/Checkbox";
import { Tooltip } from "#/components/Tooltip";

export function FallbackAndDomainWarning({
  confirmedFallbackSetup,
  setConfirmedFallbackSetup,
}: {
  confirmedFallbackSetup: boolean;
  setConfirmedFallbackSetup: (value: boolean) => void;
}) {
  return (
    <AlertCard style="warning" title="Fallback Setting">
      <div className="flex flex-row items-center gap-x-1">
        <Checkbox
          id="set"
          checked={confirmedFallbackSetup}
          onChange={() => setConfirmedFallbackSetup(!confirmedFallbackSetup)}
          label="Approve fallback and domain verifier setup"
        />
        <Tooltip content="To use the CoW AMM you need to use the right fallback and domain verifier. Click here for more information.">
          <a
            href={
              "https://blog.cow.fi/all-you-need-to-know-about-cow-swaps-new-safe-fallback-handler-8ef0439925d1"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <InfoCircledIcon />
          </a>
        </Tooltip>
      </div>
    </AlertCard>
  );
}
