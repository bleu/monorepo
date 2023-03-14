import cn from "classnames";
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  LegacyRef,
} from "react";

export const Button = forwardRef(function (
  {
    children,
    className,
    ...rest
  }: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  ref: LegacyRef<HTMLButtonElement>
) {
  return (
    <button
      ref={ref}
      {...rest}
      className={cn(
        className,
        "rounded-md py-3 px-5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      )}
    >
      {children}
    </button>
  );
});
