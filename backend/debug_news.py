import yfinance as yf
import json

try:
    symbol = "RELIANCE.NS"
    print(f"--- Testing yfinance for {symbol} ---")
    ticker = yf.Ticker(symbol)
    news = ticker.news
    print(json.dumps(news, indent=2))
except Exception as e:
    print(f"yfinance error: {e}")

try:
    import feedparser
    from urllib.parse import quote_plus
    print(f"\n--- Testing Google RSS for {symbol} ---")
    query = quote_plus(f"{symbol} stock news")
    url = f"https://news.google.com/rss/search?q={query}&hl=en-IN&gl=IN&ceid=IN:en"
    feed = feedparser.parse(url)
    print(f"Entries found: {len(feed.entries)}")
    if feed.entries:
        print(feed.entries[0].title)
        print(feed.entries[0].link)
except Exception as e:
    print(f"Google RSS error: {e}")
