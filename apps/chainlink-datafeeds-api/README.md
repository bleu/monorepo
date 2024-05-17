# Chainlink Datafeeds API

This is a small wrapper around Chainlink's [DataFeeds](https://data.chain.link/feeds) page to expose its data through an API.

## Warning

⚠️ This API is experimental and may break at any time. Use it at your own risk. Ensure to have fallback mechanisms in place if you rely on this data for critical operations.

## How It Works

The API pulls raw HTML content from the Chainlink data feeds homepage, parses it to extract the JSON data embedded within, and then converts this data into a JSON response accessible via this API.
