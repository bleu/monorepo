import cn from "clsx";
import React from "react";

enum BadgeSize {
  sm = "sm",
  md = "md",
  lg = "lg",
}

export enum BadgeColor {
  darkBlue = "blue2",
  midBlue = "blue4",
  blue = "blue6",
}

interface BadgeProps {
  children: React.ReactNode;
  size?: keyof typeof BadgeSize;
  color?: keyof typeof BadgeColor;
  isSelected?: boolean;
  isTrackingTighter?: boolean;
  outline?: boolean;
}

export function Badge({
  children,
  size = "md",
  color = "midBlue",
  isSelected = false,
  isTrackingTighter = false,
  outline = false,
}: BadgeProps) {
  const BadgeColorString = BadgeColor[color];
  const BadgeSizeString = BadgeSize[size];

  const baseClasses = "rounded text-sm font-semibold px-1 text-slate12";

  const colorClasses = cn({
    "bg-blue4": BadgeColorString === BadgeColor.midBlue,
    "bg-blue2": BadgeColorString === BadgeColor.darkBlue,
    "bg-blue6": BadgeColorString === BadgeColor.blue,
  });

  const sizeClasses = cn({
    "text-xs py-[2px]": BadgeSizeString === BadgeSize.sm,
    "py-1": BadgeSizeString === BadgeSize.md,
  });

  const additionalClasses = cn({
    "bg-blue8": isSelected && BadgeColorString === BadgeColor.midBlue,
    "tracking-tighter": isTrackingTighter,
    "border border-blue9": outline,
  });

  return (
    <span
      className={cn(baseClasses, colorClasses, sizeClasses, additionalClasses)}
    >
      {children}
    </span>
  );
}
