export function truncateAddress(address: string | undefined) {
  if (!address) return;
  const match = address.match(
    /^(0x[a-zA-Z0-9]{6})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
}
