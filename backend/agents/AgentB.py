# import yfinance as yf
# import feedparser
# from datetime import datetime
# from urllib.parse import quote_plus

# class AgentB:
#     def fetch_news(self, symbol):
#         news_list = []
        
#         # 1. Try Yahoo Finance First
#         print(f"AgentB: Fetching news for {symbol}...")
#         try:
#             ticker = yf.Ticker(symbol)
#             yf_news = ticker.news
#             print(f"AgentB: Yahoo news found: {len(yf_news) if yf_news else 0}")
#             if yf_news:
#                 for item in yf_news[:5]:
#                     news_list.append({
#                         "title": item.get("title"),
#                         "link": item.get("link"),
#                         "date": item.get("providerPublishTime", int(datetime.now().timestamp()))
#                     })
#         except Exception as e:
#             print(f"AgentB: YFinance News Error: {e}")

#         if not news_list:
#             print("AgentB: Yahoo empty, trying Google RSS...")
#             try:
#                 # Cleaner search: "Reliance Industries" is better than "RELIANCE.NS", but we only have symbol.
#                 # Use simple symbol without extension
#                 clean_symbol = symbol.split(".")[0] 
#                 query = quote_plus(f"{clean_symbol} stock news")
#                 url = f"https://news.google.com/rss/search?q={query}&hl=en-IN&gl=IN&ceid=IN:en"
                
#                 feed = feedparser.parse(url)
#                 print(f"AgentB: Google RSS entries: {len(feed.entries)}")
#                 for entry in feed.entries[:5]:
#                     dt = int(datetime.now().timestamp())
#                     if hasattr(entry, "published_parsed") and entry.published_parsed:
#                         dt = int(datetime(*entry.published_parsed[:6]).timestamp())
                    
#                     news_list.append({
#                         "title": entry.title,
#                         "link": entry.link,
#                         "date": dt
#                     })
#             except Exception as e:
#                 print(f"AgentB: Google RSS Error: {e}")
                
#         if not news_list:
#             # Hard fallback to ensure UI isn't empty
#             news_list.append({
#                 "title": f"Latest market updates for {symbol} (Source: Exchange/Aggregators)",
#                 "link": f"https://www.google.com/search?q={symbol}+stock+news",
#                 "date": int(datetime.now().timestamp())
#             })

#         import json
#         print(f"DEBUG AGENT B FINAL LIST: {json.dumps(news_list, indent=2)}")
#         return {
#             "symbol": symbol,
#             "news": news_list
#         }


import yfinance as yf
import feedparser
from datetime import datetime
from urllib.parse import quote_plus
from duckduckgo_search import DDGS


class AgentB:
    def fetch_news(self, symbol):
        news_list = []

        print(f"AgentB: Fetching news for {symbol}...")

        # -------------------------------------------------
        # 1. Try Yahoo Finance First
        # -------------------------------------------------
        try:
            ticker = yf.Ticker(symbol)
            yf_news = ticker.news
            print(f"AgentB: Yahoo news found: {len(yf_news) if yf_news else 0}")

            if yf_news:
                for item in yf_news:
                    title = None
                    link = None

                    # Yahoo format 1
                    if item.get("title") and item.get("link"):
                        title = item.get("title")
                        link = item.get("link")

                    # Yahoo format 2 (nested)
                    elif item.get("content"):
                        title = item["content"].get("title")
                        link = (
                            item["content"]
                            .get("canonicalUrl", {})
                            .get("url")
                        )

                    # Add only valid items
                    if title and link:
                        news_list.append({
                            "title": title,
                            "link": link,
                            "date": item.get(
                                "providerPublishTime",
                                int(datetime.now().timestamp())
                            )
                        })

                    # Limit to 5 clean news items
                    if len(news_list) == 5:
                        break

        except Exception as e:
            print(f"AgentB: YFinance News Error: {e}")

        # -------------------------------------------------
        # 2. DuckDuckGo Search Fallback
        # -------------------------------------------------
        if not news_list:
            print("AgentB: Yahoo empty or invalid, trying DuckDuckGo...")
            try:
                # Use a specific query for recent news
                query = f"{symbol} stock news recent"
                
                # Fetch more results to filter
                with DDGS() as ddgs:
                    results = [r for r in ddgs.text(keywords=query, region='in-en', max_results=10)]
                
                print(f"AgentB: DuckDuckGo found: {len(results)}")
                
                for item in results:
                    # DDGS returns: {'title': ..., 'href': ..., 'body': ...}
                    title = item.get("title")
                    link = item.get("href")
                    
                    if title and link:
                        news_list.append({
                            "title": title,
                            "link": link,
                            "date": int(datetime.now().timestamp()) # DDGS doesn't always give date
                        })
                    
                    if len(news_list) >= 5:
                        break
                        
            except Exception as e:
                print(f"AgentB: DuckDuckGo Error: {e}")

        # -------------------------------------------------
        # 3. Hard fallback (never return empty)
        # -------------------------------------------------
        if not news_list:
            news_list.append({
                "title": f"Latest market updates for {symbol}",
                "link": f"https://www.google.com/search?q={symbol}+stock+news",
                "date": int(datetime.now().timestamp())
            })

        # -------------------------------------------------
        # Debug output
        # -------------------------------------------------
        import json
        print(f"DEBUG AGENT B FINAL LIST:\n{json.dumps(news_list, indent=2)}")

        return {
            "symbol": symbol,
            "news": news_list
        }
