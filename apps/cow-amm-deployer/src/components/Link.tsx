"use client";

import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import React from "react";

import { Spinner } from "./Spinner";

export function LinkComponent({
  href,
  children,
  className,
}: {
  href: Url;
  children: React.ReactElement;
  className?: string;
}) {
  const [isLoading, setIsLoading] = React.useState(false);

  const ClonedElement = React.cloneElement(children, {
    children: isLoading ? <Spinner size={"sm"} /> : children.props.children,
  });

  if (children.props.disabled) {
    return <div className={className}>{ClonedElement}</div>;
  }

  return (
    <Link
      href={href.toString()}
      prefetch={false}
      className={className}
      onClick={() => {
        setIsLoading(true);
      }}
    >
      {ClonedElement}
    </Link>
  );
}
