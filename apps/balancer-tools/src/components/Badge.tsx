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
}

export function Badge({
  children,
  size = "md",
  color = "midBlue",
  isSelected = false,
  isTrackingTighter = false,
}: BadgeProps) {
  const BadgeColorString = BadgeColor[color];
  const BadgeSizeString = BadgeSize[size];

  const baseClasses = "rounded text-sm font-bold px-1 text-slate12";

  const colorClasses = cn({
    "bg-blue4": BadgeColorString === BadgeColor.midBlue,
    "bg-blue2": BadgeColorString === BadgeColor.darkBlue,
    "bg-blue6 border border-blue9": BadgeColorString === BadgeColor.blue,
  });

  const additionalClasses = cn({
    "bg-blue8": isSelected && BadgeColorString === BadgeColor.midBlue,
    "tracking-tighter": isTrackingTighter,
    "text-xs font-semibold py-[2px]": BadgeSizeString === BadgeSize.sm,
    "py-1": BadgeSizeString === BadgeSize.md,
  });

  return (
    <span className={cn(baseClasses, colorClasses, additionalClasses)}>
      {children}
    </span>
  );
}
