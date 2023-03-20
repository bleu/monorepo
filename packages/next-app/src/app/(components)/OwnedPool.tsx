
import { truncateAddress } from "#/utils/truncateAddress";

interface IOwnedPool {
  isSelected: boolean;
  pool: any;
}

export function OwnedPool({ isSelected, pool }: IOwnedPool) {
  const backgroundColor = isSelected ? "bg-gray-700" : "bg-gray-800";
  const { poolType, tokens, name, address } = pool;

  const poolName =
    poolType === "Weighted" && tokens
      ? tokens.map((obj:any) => obj.symbol).join("/")
      : name;
  const weights =
    poolType === "Weighted" && tokens
      ? tokens.map((obj:any) => (Number(obj.weight) * 100).toFixed()).join("/")
      : null;

  return (
    <button
      className={`h-20 w-full p-2 ${backgroundColor} group self-stretch hover:bg-gray-700`}
    >
      <div className="flex w-full flex-col space-y-1">
        <div className="flex items-center space-x-3 self-stretch">
          <p
            className={`text-lg font-bold text-gray-200 group-hover:text-yellow-400`}
          >
            {poolName}
          </p>
          {weights && (
            <span
              className={`rounded p-[1px] text-sm font-bold ${
                isSelected ? "bg-yellow-100" : "bg-blue-200"
              } text-gray-800 group-hover:bg-yellow-100`}
            >
              {weights}
            </span>
          )}
        </div>
        <div className="flex w-full items-center space-x-3">
          <span className="rounded border border-gray-500 p-[3px] text-sm font-bold uppercase leading-4 text-gray-500 group-hover:text-gray-400">
            {poolType}
          </span>
          <p className="text-sm leading-tight text-gray-500 group-hover:text-gray-400">
            {truncateAddress(address)}
          </p>
        </div>
      </div>
    </button>
  );
}
