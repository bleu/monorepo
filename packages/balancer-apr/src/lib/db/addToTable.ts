/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-env node */
// eslint-disable-next-line @typescript-eslint/no-var-requires
import "dotenv/config";

import { db } from "../../db/index";

export const BATCH_SIZE = 1_000;

export function* chunks(arr: unknown[], n: number) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}

export async function addToTable(
  table: any,
  items?: any[],
  onConflictStatement: any = null,
) {
  console.log("addToTable", table, onConflictStatement, items);
  if (!items?.length) {
    return [];
  }

  const chunkedItems = [...chunks(items, BATCH_SIZE)];
  return await Promise.all(
    chunkedItems.map(async (items) => {
      return onConflictStatement
        ? await db
            .insert(table)
            .values(items)
            .onConflictDoUpdate(onConflictStatement)
        : await db.insert(table).values(items).onConflictDoNothing();
    }),
  );
}
