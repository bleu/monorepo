"use client";

import { Spinner } from "#/components/Spinner";
import Table from "#/components/Table";
import { useUserMilkmanTransactions } from "#/hooks/useUserMilkmanTransactions";

import { TableRowTransaction } from "./TableRowTransaction";

export function OrderTable() {
  const { transactions, cowOrders, hasToken, loaded } =
    useUserMilkmanTransactions();

  if (!loaded) {
    return <Spinner />;
  }
  return (
    <Table color="blue" shade="darkWithBorder">
      <Table.HeaderRow>
        <Table.HeaderCell>
          <span className="sr-only"></span>
        </Table.HeaderCell>
        <Table.HeaderCell>Sell Token</Table.HeaderCell>
        <Table.HeaderCell>Sell Amount</Table.HeaderCell>
        <Table.HeaderCell>Buy Token</Table.HeaderCell>
        <Table.HeaderCell>Status</Table.HeaderCell>
        <Table.HeaderCell>
          <span className="sr-only">Cancel</span>
        </Table.HeaderCell>
      </Table.HeaderRow>
      <Table.Body classNames="max-h-80 overflow-y-auto">
        {transactions?.map((transaction, index) => (
          <TableRowTransaction
            key={transaction.id}
            transaction={transaction}
            cowOrders={cowOrders?.[index]}
            hasToken={hasToken?.[index]}
          />
        ))}
        {transactions?.length === 0 && (
          <Table.BodyRow>
            <Table.BodyCell colSpan={6}>
              <h1 className="text-md text-slate12 m-2 text-center w-full">
                This address didn't made any order on Milkman yet
              </h1>
            </Table.BodyCell>
          </Table.BodyRow>
        )}
      </Table.Body>
    </Table>
  );
}
