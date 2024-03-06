"use client";

import { load, trackPageview } from "fathom-client";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

const appUrl = "deploy-cow-amm.bleu.fi";
const fathomId = "VYHECOUI";

function TrackPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    load(fathomId, {
      includedDomains: [appUrl],
      auto: false,
    });
  }, []);

  useEffect(() => {
    if (!pathname) return;

    trackPageview({
      url: pathname,
      referrer: document.referrer,
    });
  }, [pathname, searchParams]);

  return null;
}

export default function Fathom() {
  return (
    <Suspense fallback={null}>
      <TrackPageView />
    </Suspense>
  );
}
