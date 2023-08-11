import "server-only";

import { DuneClient, QueryParameter } from "@cowprotocol/ts-dune-client";
import invariant from "tiny-invariant";

import { Round } from "#/app/apr/(utils)/rounds";

const duneApiKey = process.env.DUNE_API_KEY;

interface DunePoolData {
  pct_votes: number;
  symbol: string;
  votes: number;
}

interface TVLData {
  blockchain: string;
  tvl: number;
};

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
  ): Promise<undefined | DunePoolData[] | ErrorReturn> {
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
      .then(
        (executionResult) =>
          executionResult.result?.rows as unknown as DunePoolData[],
      )
      .catch((error: { message: string }) => ({ error: error.message }));
  }

  async getTVLByRoundId(
    roundId: number = 0,
  ): Promise<undefined | TVLData[] | ErrorReturn> {
    invariant(roundId > 0, "An valid roundId must be passed");
    const roundData = Round.getRoundByNumber(roundId);
    // Ex for Round 1: 
    // https://dune.com/queries/2842639?2.+Start+date_d83555=2022-04-13+00%3A00%3A00
    const queryId = 2842639;
    const parameters = [
      QueryParameter.number("End date", roundData.endDate.toISOString().slice(0, 10)),
    ];

    return this.client
      .refresh(queryId, parameters)
      .then(
        (executionResult) =>
          executionResult.result?.rows as unknown as TVLData[],
      )
      .catch((error: { message: string }) => ({ error: error.message }));
  }
}
