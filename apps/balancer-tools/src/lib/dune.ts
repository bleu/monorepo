import "server-only";

import { DuneClient, QueryParameter } from "@cowprotocol/ts-dune-client";
import invariant from "tiny-invariant";

const duneApiKey = process.env.DUNE_API_KEY;

export interface Row {
  pct_votes: number;
  symbol: string;
  votes: number;
}

interface ErrorReturn {
  error: string;
}

export class DuneAPI {
  private client: DuneClient;

  constructor() {
    this.client = new DuneClient(duneApiKey ?? "");
  }

  async getPoolsByRoundId(roundId: number = 0): Promise<Row[] | ErrorReturn> {
    invariant(roundId > 0, "An valid roundId must be passed");
    const parameters = [QueryParameter.text("round_id", String(roundId))];

    return this.client
      .refresh(2834602, parameters)
      .then((executionResult) => executionResult.result?.rows)
      .catch((error) => ({ error: error.message }));
  }
}
