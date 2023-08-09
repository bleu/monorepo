import "server-only";

import { DuneClient, QueryParameter } from "@cowprotocol/ts-dune-client";
import invariant from "tiny-invariant";

const duneApiKey = process.env.DUNE_API_KEY;

export interface DunePoolData {
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

  async getPoolsByRoundId(
    roundId: number = 0,
    limitBy: number = 20,
    offsetBy: number = 0,
  ): Promise<DunePoolData[] | ErrorReturn> {
    invariant(roundId > 0, "An valid roundId must be passed");
    // https://dune.com/queries/2834602/4732373
    const queryId = 2834602;
    const parameters = [
      QueryParameter.number("round_id", roundId),
      QueryParameter.number("limit_by", limitBy),
      QueryParameter.number("offset_by", offsetBy),
    ];

    return this.client
      .refresh(queryId, parameters)
      .then((executionResult) => executionResult.result?.rows)
      .catch((error) => ({ error: error.message }));
  }
}
