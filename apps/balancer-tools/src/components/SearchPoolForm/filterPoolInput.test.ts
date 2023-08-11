import filterPoolInput, { Pool } from "./filterPoolInput";

describe("filterPoolInput function", () => {
  const mockPools: Pool[] = [
    {
      id: "0x0017c363b29d8f86d82e9681552685f68f34b7e4000200000000000000000209",
      address: "0x0017c363b29d8f86d82e9681552685f68f34b7e4",
      name: "Skorge Copper LBP",
      poolType: "LiquidityBootstrapping",
      symbol: "Skorge_LBP",
      totalLiquidity: "0.000001000000025784848219663865585262822",
      tokens: [
        {
          symbol: "USDC",
        },
        {
          symbol: "Skorge",
        },
      ],
    },
    {
      id: "0x0022b6e4ff3ddbf0c36c7c6c7c7f3062f36be5f8000200000000000000000330",
      address: "0x0022b6e4ff3ddbf0c36c7c6c7c7f3062f36be5f8",
      name: "SHHH Copper LBP",
      poolType: "LiquidityBootstrapping",
      symbol: "SHHH_LBP",
      totalLiquidity: "0.000001000000045104426850456188493054481",
      tokens: [
        {
          symbol: "USDC",
        },
        {
          symbol: "SHHH",
        },
      ],
    },
    {
      id: "0x00612eb4f312eb6ace7acc8781196601078ae3390002000000000000000005a2",
      address: "0x00612eb4f312eb6ace7acc8781196601078ae339",
      name: "20GHO-80PSP",
      poolType: "Weighted",
      symbol: "20GHO-80PSP",
      totalLiquidity: "935.776172612115125739114553555563",
      tokens: [
        {
          symbol: "GHO",
        },
        {
          symbol: "PSP",
        },
      ],
    },
  ];

  it("should return true when poolSearchQuery is empty", () => {
    const pool = mockPools[0];
    const result = filterPoolInput({ poolSearchQuery: "", pool });
    expect(result).toBe(true);
  });

  it("should return false when pool is not provided", () => {
    const result = filterPoolInput({ poolSearchQuery: "Skorge" });
    expect(result).toBe(false);
  });

  it("should filter by token symbol", () => {
    const USDCvSHHHPool = mockPools[1];
    const result = filterPoolInput({
      poolSearchQuery: "USDC",
      pool: USDCvSHHHPool,
    });
    expect(result).toBe(true);
  });

  it("should filter by pool name", () => {
    const pool = mockPools[0];
    const result = filterPoolInput({
      poolSearchQuery: "Skorge Copper LBP",
      pool,
    });
    expect(result).toBe(true);
  });

  it("should return false for non-matching queries", () => {
    const pool = mockPools[0];
    const result = filterPoolInput({ poolSearchQuery: "NonExistent", pool });
    expect(result).toBe(false);
  });
});
