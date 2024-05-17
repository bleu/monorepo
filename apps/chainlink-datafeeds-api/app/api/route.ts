const HOUR_IN_S = 3600;

export async function GET() {
  const res = await fetch("https://data.chain.link/feeds", {
    next: { revalidate: HOUR_IN_S },
  });
  const rawHTML = await res.text();

  const match = rawHTML.match(
    /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/
  );

  if (!match?.length) return Response.json({ error: "No data found" });

  const pagePropsData = JSON.parse(match[1]);
  const data = pagePropsData.props.pageProps;

  if (!data) return Response.json({ error: "No data found" });

  return Response.json({ data });
}
