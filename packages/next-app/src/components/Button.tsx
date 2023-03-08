import cn from "classnames";

export function Button({
  children,
  className,
  ...rest
}: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      {...rest}
      className={cn(
        "rounded-md py-2 px-3 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        className
      )}
    >
      {children}
    </button>
  );
}
