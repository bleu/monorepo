"use client";

import React from "react";

import { cowTokenList } from "#/lib/cowTokenList";
import { IToken } from "#/lib/fetchAmmData";
import { ChainId } from "#/utils/chainsPublicClients";

interface ITokenWithChainId extends IToken {
  chainId: ChainId;
}

interface ITokenSelectContext {
  getTokenList: (chainId: ChainId) => IToken[];
  addImportedToken: (token: IToken, chainId: ChainId) => void;
}

export const TokenSelectContext = React.createContext<ITokenSelectContext>(
  {} as ITokenSelectContext,
);

export const TokenSelectContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [importedTokenList, setImportedTokenList] = React.useState<
    ITokenWithChainId[]
  >(
    (JSON.parse(
      // @ts-ignore
      localStorage.getItem("importedTokens"),
    ) as ITokenWithChainId[] | null) ?? [],
  );

  function getTokenList(chainId: ChainId) {
    return [
      ...(cowTokenList.filter(
        (token) => token.chainId === chainId,
      ) as IToken[]),
      ...importedTokenList,
    ];
  }

  function addImportedToken(token: IToken, chainId: ChainId) {
    const newImportedTokenList = [...importedTokenList, { ...token, chainId }];
    setImportedTokenList(newImportedTokenList);
    localStorage.setItem(
      "importedTokens",
      JSON.stringify(newImportedTokenList),
    );
  }

  return (
    <TokenSelectContext.Provider
      value={{
        getTokenList,
        addImportedToken,
      }}
    >
      {children}
    </TokenSelectContext.Provider>
  );
};

export const useTokenSelect = () => React.useContext(TokenSelectContext);
