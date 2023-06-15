import cn from "clsx";
import { Children, cloneElement, forwardRef, isValidElement } from "react";

const predefinedClasses = {
  blue: {
    solid: {
      light: "bg-blue9 text-slate12 hover:bg-blue10 border-blue9",
      dark: "bg-blue3 text-slate12 hover:bg-blue4 border-blue3",
    },
    outline: {
      light:
        "bg-transparent text-blue9 border-blue9 hover:bg-blue2 hover:border-blue2",
      dark: "bg-transparent text-blue3 border-blue3 hover:bg-blue2 hover:border-blue2",
    },
  },
  cyan: {
    solid: {
      light: "bg-cyan9 text-slate12 hover:bg-cyan10 border-cyan9",
      dark: "bg-cyan3 text-slate12 hover:bg-cyan4 border-cyan3",
    },
    outline: {
      light:
        "bg-transparent text-cyan9 border-cyan9 hover:bg-cyan2 hover:border-cyan2",
      dark: "bg-transparent text-cyan3 border-cyan3 hover:bg-cyan2 hover:border-cyan2",
    },
  },
  amber: {
    solid: {
      light: "bg-amber9 text-slate12 hover:bg-amber10 border-amber9",
      dark: "bg-amber3 text-slate12 hover:bg-amber4 border-amber3",
    },
    outline: {
      light:
        "bg-transparent text-amber10 border-amber9 hover:bg-amber2 hover:border-amber2",
      dark: "bg-transparent text-amber10 border-amber3 hover:bg-amber2 hover:border-amber2",
    },
  },
  slate: {
    solid: {
      light: "bg-slate9 text-slate12 hover:bg-slate10 border-slate9",
      dark: "bg-slate3 text-slate12 hover:bg-slate4 border-slate3",
    },
    outline: {
      light:
        "bg-transparent text-slate9 border-slate9 hover:bg-slate2 hover:border-slate2",
      dark: "bg-transparent text-slate3 border-slate3 hover:bg-slate2 hover:border-slate2",
    },
  },
} as const;

type ButtonColor = keyof typeof predefinedClasses;
type ButtonVariant = keyof typeof predefinedClasses.blue;
type ButtonShade = keyof typeof predefinedClasses.blue.solid;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  variant?: ButtonVariant;
  shade?: ButtonShade;
  className?: string;
}

const Button = forwardRef(function (
  {
    className = "",
    children,
    color = "blue",
    variant = "solid",
    shade = "light",
    disabled = false,
    ...rest
  }: ButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  let hasIconLeft = false;

  const modifiedChildren = Children.map(children, (child) => {
    if (isValidElement(child) && child.type === ButtonIcon) {
      const positionClass = hasIconLeft ? "ml-2" : "mr-2";
      hasIconLeft = true;

      return cloneElement(child, {
        // @ts-expect-error
        className: positionClass,
      });
    }
    return child;
  });

  const buttonClasses = predefinedClasses[color][variant][shade];

  return (
    <button
      ref={ref}
      {...rest}
      disabled={disabled}
      className={cn(
        className,
        buttonClasses,
        "rounded-md py-3 px-5 text-center text-sm font-semibold border focus-visible:outline-blue7 focus-visible:outline-offset-2 disabled:opacity-40"
      )}
    >
      {modifiedChildren}
    </button>
  );
});

export function ButtonIcon({ icon }: { icon: React.ReactNode }) {
  return <span>{icon}</span>;
}

export default Button;
