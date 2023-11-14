import { Address } from "@bleu-fi/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { FieldValues, useForm, UseFormReturn } from "react-hook-form";
import { createPublicClient, http } from "viem";
import { goerli } from "viem/chains";

import { TransactionStatus } from "#/app/milkman/utils/type";
import Button from "#/components/Button";
import { Checkbox } from "#/components/Checkbox";
import { Dialog } from "#/components/Dialog";
import { Input } from "#/components/Input";
import { Select, SelectItem } from "#/components/Select";
import Table from "#/components/Table";
import { Form, FormLabel, FormMessage } from "#/components/ui/form";
import { Label } from "#/components/ui/label";
import { chainlinkPriceFeeAbi } from "#/lib/abis/chainlinkPriceFeed";
import { PRICE_CHECKERS, priceCheckerInfoMapping } from "#/lib/priceCheckers";
import { getPriceFeedChainlinkSchema } from "#/lib/schema";
import { truncateAddress } from "#/utils/truncate";

import { FormFooter } from "./Footer";

export function FormSelectPriceChecker({
  onSubmit,
  defaultValues,
  tokenSellAddress,
  tokenBuyAddress,
}: {
  onSubmit: (data: FieldValues) => void;
  defaultValues?: FieldValues;
  tokenSellAddress: Address;
  tokenBuyAddress: Address;
}) {
  const [selectedPriceChecker, setSelectedPriceChecker] =
    useState<PRICE_CHECKERS>(defaultValues?.priceChecker);

  const publicClient = createPublicClient({
    chain: goerli,
    transport: http(),
  });

  const schema =
    selectedPriceChecker &&
    priceCheckerInfoMapping[selectedPriceChecker].getSchema({
      tokenSellAddress,
      tokenBuyAddress,
      publicClient,
    });

  const form = useForm(
    selectedPriceChecker && {
      resolver: zodResolver(schema),
      mode: "onSubmit",
    },
  );

  const {
    register,
    clearErrors,
    setValue,
    formState: { errors },
  } = form;

  useEffect(() => {
    clearErrors();
    register("priceChecker");
    register("priceCheckerAddress");
    if (!selectedPriceChecker) {
      return;
    }
    setValue("priceChecker", selectedPriceChecker);
    setValue(
      "priceCheckerAddress",
      priceCheckerInfoMapping[selectedPriceChecker].addresses[goerli.id],
    );
  }, [selectedPriceChecker]);

  return (
    <Form {...form} onSubmit={onSubmit} className="flex flex-col gap-y-6 p-9">
      <div className="mb-2">
        <Label>Price checker</Label>
        <Select
          onValueChange={(priceChecker) => {
            setSelectedPriceChecker(priceChecker as PRICE_CHECKERS);
          }}
          className="w-full mt-2"
          defaultValue={defaultValues?.priceChecker}
        >
          {Object.values(PRICE_CHECKERS).map((priceChecker) => (
            <SelectItem value={priceChecker} key={priceChecker}>
              {priceChecker}
            </SelectItem>
          ))}
        </Select>
        {errors.priceChecker && (
          <FormMessage className="h-6 text-sm text-tomato10 w-full">
            <span>{errors.priceChecker.message as string}</span>
          </FormMessage>
        )}
      </div>
      {selectedPriceChecker && (
        <PriceCheckerInputs form={form} priceChecker={selectedPriceChecker} />
      )}
      <FormFooter
        transactionStatus={TransactionStatus.ORDER_STRATEGY}
        disabled={!selectedPriceChecker}
      />
    </Form>
  );
}

function PriceCheckerInputs({
  priceChecker,
  form,
}: {
  priceChecker: PRICE_CHECKERS;
  form: UseFormReturn;
}) {
  const priceCheckerInfo = priceCheckerInfoMapping[priceChecker];
  const { register } = form;
  switch (priceChecker) {
    case PRICE_CHECKERS.CHAINLINK:
      return <ChainlinkPriceCheckerInput form={form} />;
    default:
      return (
        <>
          {priceCheckerInfo.arguments.map((arg) => (
            <Input
              type={arg.inputType}
              label={arg.label}
              key={arg.name}
              {...register(arg.name)}
            />
          ))}
        </>
      );
  }
}

function ChainlinkPriceCheckerInput({ form }: { form: UseFormReturn }) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    register("priceFeeds");
    setValue("priceFeeds", []);
    register("addressesPriceFeeds");
    setValue("addressesPriceFeeds", []);
    register("revertPriceFeeds");
    setValue("revertPriceFeeds", []);
  }, []);

  const priceFeeds = watch("priceFeeds") as {
    address: Address;
    description: string;
    reversed: boolean;
  }[];

  return (
    <div className="flex flex-col w-full gap-y-2">
      <Input
        type="number"
        label="Allowed slippage (%)"
        {...register("allowedSlippageInBps")}
      />
      <FormLabel className="my-2 block text-sm text-slate12">
        Chainlink Price Feed Path
      </FormLabel>
      <Table color="blue" shade="darkWithBorder">
        <Table.HeaderRow>
          <Table.HeaderCell>Price Feed Address</Table.HeaderCell>
          <Table.HeaderCell>Description</Table.HeaderCell>
          <Table.HeaderCell>Reversed</Table.HeaderCell>
          <Table.HeaderCell>
            <Dialog
              isOpen={isOpen}
              customWidth="w-[100vw] max-w-[550px]"
              setIsOpen={setIsOpen}
              content={
                <ChainlinkAddModal
                  setIsOpen={setIsOpen}
                  priceCheckerForm={form}
                />
              }
            >
              <Button type="button" className="p-2">
                <PlusIcon className="w-5 h-5 items-end" />
              </Button>
            </Dialog>
          </Table.HeaderCell>
        </Table.HeaderRow>
        <Table.Body>
          {priceFeeds &&
            priceFeeds.map((priceFeed, index) => (
              <Table.BodyRow key={index}>
                <Table.BodyCell>
                  {truncateAddress(priceFeed.address)}
                </Table.BodyCell>
                <Table.BodyCell>{priceFeed.description}</Table.BodyCell>
                <Table.BodyCell>
                  {priceFeed.reversed ? "Yes" : "No"}
                </Table.BodyCell>
                <Table.BodyCell>
                  <div className="flex items-center justify-center">
                    <button
                      className="ustify-self-center text-tomato9 hover:text-tomato10 "
                      type="button"
                      onClick={() => {
                        setValue("priceFeeds", [
                          ...priceFeeds.slice(0, index),
                          ...priceFeeds.slice(index + 1),
                        ]);
                      }}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </Table.BodyCell>
              </Table.BodyRow>
            ))}
        </Table.Body>
      </Table>
      {errors.priceFeeds && (
        <FormMessage className="h-6 text-sm text-tomato10 w-full">
          <span>{errors.priceFeeds.message as string}</span>
        </FormMessage>
      )}
    </div>
  );
}

function ChainlinkAddModal({
  priceCheckerForm,
  setIsOpen,
}: {
  priceCheckerForm: UseFormReturn;
  setIsOpen: (open: boolean) => void;
}) {
  const {
    setValue: setValuePriceCheckerForm,
    getValues: getValuesPriceCheckerForm,
  } = priceCheckerForm;

  const publicClient = createPublicClient({
    chain: goerli,
    transport: http(),
  });
  const priceFeedChainlinkSchema = getPriceFeedChainlinkSchema(publicClient);

  const newPriceFeedForm = useForm<typeof priceFeedChainlinkSchema._type>({
    resolver: zodResolver(priceFeedChainlinkSchema),
  });
  const { register, watch, setValue } = newPriceFeedForm;
  const formData = watch();

  const onSubmit = async (data: FieldValues) => {
    const description = await publicClient.readContract({
      address: data.priceFeedAddress as Address,
      abi: chainlinkPriceFeeAbi,
      functionName: "description",
      args: [],
    });
    setValuePriceCheckerForm("priceFeeds", [
      ...getValuesPriceCheckerForm("priceFeeds"),
      {
        address: data.priceFeedAddress,
        description,
        reversed: data.reversed,
      },
    ]);
    setValuePriceCheckerForm("addressesPriceFeeds", [
      ...getValuesPriceCheckerForm("addressesPriceFeeds"),
      data.priceFeedAddress,
    ]);
    setValuePriceCheckerForm("revertPriceFeeds", [
      ...getValuesPriceCheckerForm("revertPriceFeeds"),
      data.reversed,
    ]);
    setIsOpen(false);
  };

  return (
    <Form
      {...newPriceFeedForm}
      onSubmit={onSubmit}
      className="flex flex-col w-full text-white gap-y-2"
    >
      <FormLabel className="mb-2 block text-md text-slate12">
        New Chainlink Price Feed
      </FormLabel>
      <Input
        label="Price Feed Address"
        placeholder="0x..."
        {...register("priceFeedAddress")}
      />
      <Checkbox
        id="reversed"
        checked={formData.reversed}
        label="Reversed"
        onChange={() => {
          setValue("reversed", !formData.reversed);
        }}
      />
      <Button type="submit">Add price feed</Button>
    </Form>
  );
}
