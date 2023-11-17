import { Address } from "@bleu-fi/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil1Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
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
import {
  priceCheckerAddressesMapping,
  priceCheckersArgumentsMapping,
} from "#/lib/priceCheckersMappings";
import {
  generatePriceCheckerSchema,
  getPriceFeedChainlinkSchema,
} from "#/lib/schema";
import { PRICE_CHECKERS, PriceCheckerArgument } from "#/lib/types";
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
    generatePriceCheckerSchema({
      priceChecker: selectedPriceChecker,
      expectedArgs: priceCheckersArgumentsMapping[selectedPriceChecker],
    })({
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
      priceCheckerAddressesMapping[selectedPriceChecker][goerli.id],
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
        <PriceCheckerInputs
          form={form}
          priceChecker={selectedPriceChecker}
          defaultValues={defaultValues}
        />
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
  defaultValues,
}: {
  priceChecker: PRICE_CHECKERS;
  form: UseFormReturn;
  defaultValues?: FieldValues;
}) {
  const priceCheckerAguments = priceCheckersArgumentsMapping[priceChecker];
  const nonArrayArguments = priceCheckerAguments.filter(
    (arg) => !arg.type.includes("[]"),
  );

  const arrayArguments = priceCheckerAguments.filter((arg) =>
    arg.type.includes("[]"),
  );

  const { register } = form;

  return (
    <div className="flex flex-col w-full gap-y-2">
      {nonArrayArguments.map((arg) => (
        <Input
          type={arg.inputType}
          label={arg.label}
          key={arg.name}
          defaultValue={defaultValues?.[arg.name]}
          {...register(arg.name)}
        />
      ))}
      {arrayArguments.length > 0 && (
        <ArrayPriceCheckerInput
          arrayArguments={arrayArguments}
          form={form}
          defaultValues={defaultValues}
        />
      )}
    </div>
  );
}

function ArrayPriceCheckerInput({
  arrayArguments,
  form,
  defaultValues,
}: {
  arrayArguments: PriceCheckerArgument[];
  form: UseFormReturn;
  defaultValues?: FieldValues;
}) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const [isOpen, setIsOpen] = useState(false);
  const [indexToEdit, setIndexToEdit] = useState(-1);

  useEffect(() => {
    arrayArguments.forEach((arg) => {
      register(arg.name);
      setValue(arg.name, defaultValues?.[arg.name] || []);
    });
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
        defaultValue={defaultValues?.allowedSlippageInBps}
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
                  indexToEdit={indexToEdit}
                />
              }
            >
              <Button
                type="button"
                className="px-5 py-2"
                onClick={() => {
                  setIndexToEdit(-1);
                }}
              >
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
                  <div className="flex items-center justify-center gap-x-2">
                    <button
                      className="justify-self-center text-amber9 hover:text-amber10 "
                      type="button"
                      onClick={() => {
                        setIndexToEdit(index);
                        setIsOpen(true);
                      }}
                    >
                      <Pencil1Icon className="w-5 h-5" />
                    </button>
                    <button
                      className="justify-self-center text-tomato9 hover:text-tomato10 "
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
  indexToEdit = -1,
}: {
  priceCheckerForm: UseFormReturn;
  setIsOpen: (open: boolean) => void;
  indexToEdit?: number;
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

  useEffect(() => {
    if (indexToEdit !== -1) {
      const priceFeeds = getValuesPriceCheckerForm("priceFeeds") as {
        address: Address;
        description: string;
        reversed: boolean;
      }[];
      const priceFeed = priceFeeds[indexToEdit];
      setValue("priceFeedAddress", priceFeed.address);
      setValue("reversed", priceFeed.reversed);
    }
  }, []);

  const newPriceFeedForm = useForm<typeof priceFeedChainlinkSchema._type>({
    resolver: zodResolver(priceFeedChainlinkSchema),
  });
  const { register, watch, setValue } = newPriceFeedForm;
  const formData = watch();

  function addPriceFeed(data: FieldValues, description: string) {
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
  }
  function editPriceFeed(
    data: FieldValues,
    description: string,
    index: number,
  ) {
    const priceFeeds = getValuesPriceCheckerForm("priceFeeds") as {
      address: Address;
      description: string;
      reversed: boolean;
    }[];
    priceFeeds[index] = {
      address: data.priceFeedAddress,
      description,
      reversed: data.reversed,
    };
    setValuePriceCheckerForm("priceFeeds", priceFeeds);
    setValuePriceCheckerForm(
      "addressesPriceFeeds",
      priceFeeds.map((priceFeed) => priceFeed.address),
    );
    setValuePriceCheckerForm(
      "revertPriceFeeds",
      priceFeeds.map((priceFeed) => priceFeed.reversed),
    );
  }

  const onSubmit = async (data: FieldValues) => {
    const description = (await publicClient.readContract({
      address: data.priceFeedAddress as Address,
      abi: chainlinkPriceFeeAbi,
      functionName: "description",
      args: [],
    })) as string;
    if (indexToEdit === -1) {
      addPriceFeed(data, description);
    } else {
      editPriceFeed(data, description, indexToEdit);
    }
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
