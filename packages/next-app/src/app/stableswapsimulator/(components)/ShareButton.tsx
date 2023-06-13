import { Share1Icon } from "@radix-ui/react-icons";

import Button from "#/components/Button";
import { useStableSwap } from "#/contexts/StableSwapContext";

export function ShareButton() {
  const { initialData, customData } = useStableSwap();
  const state = {
    initialData,
    customData,
  };
  function generateLink() {
    const jsonState = JSON.stringify(state);
    const encodedState = encodeURIComponent(jsonState);
    return `${window.location.origin}${window.location.pathname}#${encodedState}`;
  }

  return (
    <Button shade="dark">
      <div
        onClick={() => {
          navigator.clipboard.writeText(generateLink());
        }}
        className="flex flex-row gap-4"
      >
        Share simulation
        <Share1Icon
          color="white"
          className="ml-1 font-semibold"
          height={20}
          width={20}
        />
      </div>
    </Button>
  );
}
