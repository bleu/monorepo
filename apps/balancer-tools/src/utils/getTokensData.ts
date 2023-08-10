export async function getTokensData({
  networkConnectedToWallet,
}: {
  networkConnectedToWallet: number;
}) {
  const res = await fetch(
    "https://raw.githubusercontent.com/balancer/tokenlists/main/generated/listed-old.tokenlist.json",
  );
  const tokensData = await res.json();
  return tokensData.tokens.filter(
    (token: { chainId: number }) => token.chainId === networkConnectedToWallet,
  );
}
