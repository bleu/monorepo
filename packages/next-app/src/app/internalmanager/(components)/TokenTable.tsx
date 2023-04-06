/* eslint-disable no-console */
import { useAccount, useNetwork } from "wagmi";

import { Button } from "#/components";
import Table from "#/components/Table";
import { impersonateWhetherDAO, pools } from "#/lib/gql";
import { tokenDictionary } from "#/utils/getTokenInfo";
import { writeWithdrawInternalBalance } from "#/wagmi/withdrawInternalBalance";

export enum UserBalanceOpKind {
  DEPOSIT_INTERNAL,
  WITHDRAW_INTERNAL,
  TRANSFER_INTERNAL,
  TRANSFER_EXTERNAL,
}

export function TokenTable() {
  const { chain } = useNetwork();

  let { address } = useAccount();
  address = impersonateWhetherDAO(chain?.id.toString() || "1", address);

  const { data } = pools.gql(chain!.id.toString()).useInternalBalance({
    userAddress: address!.toLowerCase(),
  });

  async function handleWithdraw(tokenAddress: `0x${string}`, balance: string) {
    const { wait, hash } = await writeWithdrawInternalBalance(
      address!,
      tokenAddress,
      balance
    );
    //TODO: toast with transaction hash
    console.log("txHash", hash);

    try {
      const receipt = await wait();
      console.log(receipt.status);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex w-full justify-center">
      <div className="mt-10">
        <Table>
          <Table.HeaderRow>
            <Table.HeaderCell>Token Symbol</Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell>Balance</Table.HeaderCell>
            <Table.HeaderCell>
              <span className="sr-only">Withdraw</span>
            </Table.HeaderCell>
          </Table.HeaderRow>
          <Table.Body>
            {data?.user?.userInternalBalances?.map((token) => (
              <>
                {token.balance > 0 && (
                  <Table.BodyRow key={token.token}>
                    <Table.BodyCell>
                      {tokenDictionary[token.token].symbol}
                    </Table.BodyCell>
                    <Table.BodyCell>{token.token}</Table.BodyCell>
                    <Table.BodyCell>{token.balance}</Table.BodyCell>
                    <Table.BodyCell>
                      <Button
                        type="button"
                        className="bg-indigo-500 text-gray-50 hover:bg-indigo-400 focus-visible:outline-indigo-500 disabled:bg-gray-600 disabled:text-gray-500"
                        onClick={() =>
                          handleWithdraw(token.token, token.balance)
                        }
                      >
                        Withdraw<span className="sr-only"> token</span>
                      </Button>
                    </Table.BodyCell>
                  </Table.BodyRow>
                )}
              </>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
