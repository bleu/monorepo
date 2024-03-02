"use client";

import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import React from "react";

import { Spinner } from "./Spinner";

export function LinkComponent({
  href,
  content,
}: {
  href: Url;
  content: React.ReactElement;
}) {
  const [isLoading, setIsLoading] = React.useState(false);

  const ClonedElement = React.cloneElement(content, {
    onClick: () => setIsLoading(true),
    children: isLoading ? <Spinner size={"sm"} /> : content.props.children,
  });

  return (
    <Link href={href} prefetch={false}>
      {ClonedElement}
    </Link>
  );
}
