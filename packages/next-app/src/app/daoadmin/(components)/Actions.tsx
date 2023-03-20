import { truncateAddress } from "#/utils/truncateAddress";

interface IActions {
  isSelected: boolean;
  action: any;
}

export function Actions({ isSelected, action }: IActions) {
  const backgroundColor = isSelected ? "bg-gray-700" : "bg-gray-800";
  const { name, contractAddress, operationResponsible } = action;

  return (
    <button
      className={`w-full p-4 ${backgroundColor} group self-stretch hover:bg-gray-700`}
    >
      <div className="flex w-full flex-col space-y-1">
        <div className="flex items-center space-x-3 self-stretch">
          <p
            className={`text-lg font-bold text-gray-200 group-hover:text-yellow-400`}
          >
            {name}
          </p>
        </div>
        <div className="flex w-full items-center space-x-3">
          {operationResponsible && (
            <span
              className={`rounded p-1 text-sm font-bold ${
                isSelected ? "bg-yellow-100" : "bg-blue-200"
              } text-gray-800 group-hover:bg-yellow-100`}
            >
              {operationResponsible}
            </span>
          )}
          <p className="text-sm leading-tight text-gray-500 group-hover:text-gray-400">
            {truncateAddress(contractAddress)}
          </p>
        </div>
      </div>
    </button>
  );
}
