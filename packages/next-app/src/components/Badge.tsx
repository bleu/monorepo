import classNames from "classnames";

export function Badge({
  children,
  isSelected = false,
  isOutlined = false,
}: {
  children: React.ReactNode;
  isSelected?: boolean;
  isOutlined?: boolean;
}) {
  return (
    <span
      className={classNames(
        "rounded text-sm font-bold",
        isOutlined
          ? "bg-transparent border border-gray-500 text-gray-500 group-hover:text-gray-400 uppercase p-[3px] leading-4"
          : classNames(
              "text-gray-800 group-hover:bg-yellow-100 p-1",
              isSelected
                ? "bg-yellow-100 "
                : "bg-blue-200 text-gray-800 group-hover:bg-yellow-100"
            )
      )}
    >
      {children}
    </span>
  );
}
