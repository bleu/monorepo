"use client";

import { type Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import React from "react";

import { Spinner, type SpinnerColor } from "./Spinner";

export function LinkComponent({
  href,
  content,
  loaderColor = "blue",
}: {
  href: Url;
  content: React.ReactElement;
  loaderColor?: keyof typeof SpinnerColor;
}) {
  const [isLoading, setIsLoading] = React.useState(false);

  const ClonedElement = React.cloneElement(content, {
    onClick: () => setIsLoading(true),
    children: isLoading ? (
      <Spinner color={loaderColor} size={"sm"} />
    ) : (
      content.props.children
    ),
  });

  return <Link href={href}>{ClonedElement}</Link>;
}
