import { Address } from "viem";

import { truncateMiddle } from "#/lib/truncateMiddle";

import { LinkComponent } from "./Link";

export function TruncateMiddle({
  text,
  length = 5,
}: {
  text?: string;
  length?: number;
}) {
  if (!text) return "";
  if (text?.length > length * 2 + 1) {
    return truncateMiddle(text, length);
  }

  return text;
}

export function AddressLabel({
  address,
  label,
  truncate = true,
}: {
  address: Address;
  label: string;
  truncate?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-sm text-primary">{label}</span>
      <span className="text-sm text-primary/60">
        {truncate ? <TruncateMiddle text={address} /> : address}
      </span>
    </div>
  );
}

export function AddressLabelLink({
  address,
  label,
  href,
}: {
  address: Address;
  label: string;
  href: string;
}) {
  return (
    <LinkComponent href={href}>
      <AddressLabel address={address} label={label} />
    </LinkComponent>
  );
}
