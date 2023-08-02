import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";

import Button from "#/components/Button";
import { Input } from "#/components/Input";
import { useTabContext } from "#/components/Tabs";
import { Form } from "#/components/ui/form";
import {
  AnalysisData,
  usePoolSimulator,
} from "#/contexts/PoolSimulatorContext";
import { getStableSwapSimulatorTokensSchema } from "#/lib/schema";

import { TokensData } from "../(types)";
import { PoolSimulatorFormTabs } from "./Menu";

export default function TokenForm({
  symbolToEdit,
  close,
}: {
  symbolToEdit?: string;
  close?: () => void;
}) {
  const { initialData, setInitialData, customData, setCustomData } =
    usePoolSimulator();
  const { value: selectedTab } = useTabContext();
  const isCustomData = selectedTab === PoolSimulatorFormTabs.CustomData;

  const stableSwapTokensSchema = getStableSwapSimulatorTokensSchema({
    symbolToEdit,
    existentSymbols: initialData?.tokens?.map((token: TokensData) => {
      return token.symbol;
    }),
  });
  const form = useForm<typeof stableSwapTokensSchema._type>({
    resolver: zodResolver(stableSwapTokensSchema),
  });

  const { register } = form;

  const tokens = isCustomData ? customData?.tokens : initialData?.tokens;
  const currentToken = tokens?.find(
    (token: TokensData) => token.symbol == symbolToEdit,
  );

  const validateUniqueSymbol = (symbol: string) => {
    const tokensToCheck = initialData?.tokens?.filter(
      (token: TokensData) => token.symbol != symbolToEdit,
    );
    const symbolsToCheck = tokensToCheck?.map(
      (token: TokensData) => token.symbol,
    );
    if (symbolsToCheck?.includes(symbol)) {
      return "This symbol already exists. Please define another name.";
    }
    return true;
  };

  function addToken({
    analysisData,
    setAnalysisData,
    tokensData,
  }: {
    analysisData: AnalysisData;
    setAnalysisData: (data: AnalysisData) => void;
    tokensData: TokensData;
  }) {
    setAnalysisData({
      ...analysisData,
      tokens: [
        ...(analysisData?.tokens || []),
        {
          ...tokensData,
        },
      ],
    });
  }

  function editSymbol({
    analysisData,
    setAnalysisData,
    tokensData,
  }: {
    analysisData: AnalysisData;
    setAnalysisData: (data: AnalysisData) => void;
    tokensData: TokensData;
  }) {
    setAnalysisData({
      ...analysisData,
      tokens: analysisData?.tokens?.map((token: TokensData) => {
        if (token.symbol == symbolToEdit) {
          return {
            ...token,
            symbol: tokensData.symbol,
          };
        }
        return token;
      }),
    });
  }

  function editAll({
    analysisData,
    setAnalysisData,
    tokensData,
  }: {
    analysisData: AnalysisData;
    setAnalysisData: (data: AnalysisData) => void;
    tokensData: TokensData;
  }) {
    setAnalysisData({
      ...analysisData,
      tokens: analysisData?.tokens?.map((token: TokensData) => {
        if (token.symbol == symbolToEdit) {
          return {
            ...tokensData,
          };
        }
        return token;
      }),
    });
  }

  function handleEdit(tokensData: TokensData) {
    // Edit the balance and rate on the table
    // and the symbol on the baseline and custom
    if (isCustomData) {
      editAll({
        analysisData: customData,
        setAnalysisData: setCustomData,
        tokensData,
      });
      editSymbol({
        analysisData: initialData,
        setAnalysisData: setInitialData,
        tokensData,
      });
      return;
    }
    editAll({
      analysisData: initialData,
      setAnalysisData: setInitialData,
      tokensData,
    });
    editSymbol({
      analysisData: customData,
      setAnalysisData: setCustomData,
      tokensData,
    });
  }

  function handleAdd(tokensData: TokensData) {
    addToken({
      analysisData: customData,
      setAnalysisData: setCustomData,
      tokensData,
    });
    addToken({
      analysisData: initialData,
      setAnalysisData: setInitialData,
      tokensData,
    });
  }

  function onSubmit(tokensData: TokensData) {
    if (symbolToEdit) {
      handleEdit(tokensData);
    } else {
      handleAdd(tokensData);
    }
    close?.();
  }

  return (
    <Form onSubmit={onSubmit} id="token-form" {...form}>
      <div className="flex flex-col gap-y-4">
        <Input
          label="Symbol"
          placeholder="Define the token symbol"
          defaultValue={currentToken?.symbol}
          {...register("symbol", {
            required: true,
            validate: validateUniqueSymbol,
          })}
        />
        <Input
          label="Balance"
          placeholder="Define the token balance"
          defaultValue={currentToken?.balance}
          {...register("balance", {
            valueAsNumber: true,
            min: 0,
            required: true,
          })}
        />
        <Input
          label="Decimals"
          placeholder="Define the token decimals"
          defaultValue={currentToken?.decimal}
          {...register("decimal", {
            valueAsNumber: true,
            min: 0,
            required: true,
          })}
        />
        <Input
          label="Rate"
          placeholder="Define the token price rate"
          defaultValue={currentToken?.rate}
          {...register("rate", {
            valueAsNumber: true,
            min: 0,
            required: true,
          })}
        />
      </div>
      <div className="mt-4 flex items-center justify-end gap-3">
        <Dialog.Close asChild>
          <Button shade="light" variant="outline">
            Cancel
          </Button>
        </Dialog.Close>
        <Button form="token-form" type="submit" shade="light">
          {symbolToEdit ? "Edit" : "Add"}
        </Button>
      </div>
    </Form>
  );
}
