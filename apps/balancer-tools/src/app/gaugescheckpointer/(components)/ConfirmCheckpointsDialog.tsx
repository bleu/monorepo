import { NetworkChainId, NetworkFromNetworkChainId } from "@bleu-fi/utils";
import { formatNumber } from "@bleu-fi/utils/formatNumber";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { FieldValues, useForm } from "react-hook-form";

import Button from "#/components/Button";
import { Input } from "#/components/Input";
import { Form } from "#/components/ui/form";
import { useGaugesCheckpointer } from "#/contexts/GaugesCheckpointerContext";
import { useCheckpointGauges } from "#/hooks/gaugeschecpointer/useCheckpointGauges";
import { apiChainNameToNetworkNumber } from "#/lib/gauge-checkpointer-mappings";
import { stakelessGaugeCheckpointerAddress } from "#/wagmi/generated";

export function ConfirmCheckpointsDialog({
  setIsOpenDialog,
  reloadTable,
}: {
  setIsOpenDialog: (isOpen: boolean) => void;
  reloadTable: () => void;
}) {
  const { selectedGauges } = useGaugesCheckpointer();
  const form = useForm();
  const { register } = form;
  const { handleTransaction } = useCheckpointGauges();

  const totalBalMinted = formatNumber(
    selectedGauges.reduce((acc, gauge) => {
      return acc + (gauge.balToMint || 0);
    }, 0),
    2,
    "decimal",
    "standard",
    0.01,
  );

  const anyArbitrumGauge = selectedGauges.some(
    (gauge) => gauge.votingOption.chain === "ARBITRUM",
  );

  async function onSubmit(data: FieldValues) {
    await handleTransaction({
      ethValue: data.ethValue,
    });
    setIsOpenDialog(false);
    reloadTable();
  }

  return (
    <Form
      onSubmit={onSubmit}
      className="flex flex-col text-slate12 text-md gap-y-2"
      {...form}
    >
      <span>
        You are about to checkpoint {selectedGauges.length} gauges that will
        mint {totalBalMinted} BAL.
      </span>
      {anyArbitrumGauge && (
        <Input
          {...register("ethValue")}
          type="number"
          step={1e-18}
          label="Maximum ether value"
          tooltipText="The Arbitrum gauges checkpoint is paid. Add the maximum ETH value that you want to spend on this transaction here. Any remaining value will be returned for your account"
          tooltipLink={`https://etherscan.io/address/${stakelessGaugeCheckpointerAddress[1]}`}
        />
      )}
      <hr className="my-2" />
      {selectedGauges.map((gauge) => {
        const chainId = apiChainNameToNetworkNumber[
          gauge.votingOption.chain
        ] as NetworkChainId;
        const chainName = NetworkFromNetworkChainId[chainId];
        const poolUrl = `https://app.balancer.fi/#/${chainName}/pool/${gauge.votingOption.id}`;
        return (
          <div className="flex flex-row items-center gap-x-1">
            {gauge.votingOption.symbol} (
            {formatNumber(gauge.balToMint || 0, 2, "decimal", "standard", 0.01)}{" "}
            BAL)
            <Link href={poolUrl} target="_blank">
              <ArrowTopRightIcon className="hover:text-slate11" />
            </Link>
          </div>
        );
      })}
      <Button type="submit" className="w-full mt-2">
        <span>Checkpoint Gauges</span>
      </Button>
    </Form>
  );
}
