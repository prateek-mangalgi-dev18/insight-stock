import yfinance as yf

# Top Global Stocks
GLOBAL_TICKERS = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "BRK-B", "JPM", "V", 
    "JNJ", "WMT", "PG", "MA", "UNH", "HD", "DIS", "BAC", "KO", "PFE",
    "CSCO", "PEP", "ADBE", "NFLX", "INTC", "AMD", "CRM", "ABT", "TMO", "CMCSA"
]

# Top Indian Stocks (NSE)
INDIAN_TICKERS = [
    "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ICICIBANK.NS", "HINDUNILVR.NS",
    "ITC.NS", "SBIN.NS", "BHARTIARTL.NS", "BAJFINANCE.NS", "KOTAKBANK.NS", "LT.NS",
    "AXISBANK.NS", "ASIANPAINT.NS", "HCLTECH.NS", "MARUTI.NS", "TITAN.NS", "SUNPHARMA.NS",
    "ULTRACEMCO.NS", "WIPRO.NS", "TATAMOTORS.NS", "TATASTEEL.NS", "ADANIENT.NS", 
    "ADANIPORTS.NS", "NTPC.NS", "POWERGRID.NS", "ONGC.NS", "M&M.NS", "NESTLEIND.NS", 
    "JSWSTEEL.NS", "GRASIM.NS", "HINDALCO.NS", "DRREDDY.NS", "CIPLA.NS", "TATACONSUM.NS",
    "BRITANNIA.NS", "APOLLOHOSP.NS", "EICHERMOT.NS", "DIVISLAB.NS", "COALINDIA.NS",
    "BAJAJ-AUTO.NS", "BPCL.NS", "HEROMOTOCO.NS", "INDUSINDBK.NS", "UPL.NS", "BEL.NS",
    "HAL.NS", "VEDL.NS", "PIDILITIND.NS", "SIEMENS.NS", "SBILIFE.NS", "HDFCLIFE.NS",
    "TECHM.NS", "ADANIGREEN.NS", "ADANIPOWER.NS", "DLF.NS", "BANKBARODA.NS", "GAIL.NS",
    "IOC.NS", "AMBUJACEM.NS", "TRENT.NS", "TVSMOTOR.NS", "ZOMATO.NS"
]

def fetch_data_for_list(tickers):
    """Helper to fetch and process data for a list of tickers"""
    results = []
    try:
        tickers_str = " ".join(tickers)
        data = yf.download(tickers_str, period="5d", group_by='ticker', progress=False)
        
        for symbol in tickers:
            try:
                # Handle single ticker result vs multi ticker result structure
                if len(tickers) == 1:
                    ticker_df = data
                else:
                    ticker_df = data[symbol]
                
                valid_df = ticker_df.dropna()
                if len(valid_df) < 2:
                    continue
                    
                last_price = valid_df['Close'].iloc[-1]
                prev_price = valid_df['Close'].iloc[-2]
                volume = valid_df['Volume'].iloc[-1] if 'Volume' in valid_df else 0
                change_pct = ((last_price - prev_price) / prev_price) * 100
                
                results.append({
                    "symbol": symbol.replace('.NS', ''), # Clean up for display
                    "price": round(float(last_price), 2),
                    "change_percent": round(float(change_pct), 2),
                    "volume": int(volume)
                })
            except Exception:
                continue
    except Exception as e:
        print(f"Error fetching batch: {e}")
        
    return results

def get_market_heatmap():
    """
    Fetches daily change % for Indian and Global stocks.
    Returns: { "indian": [...], "global": [...] }
    """
    indian_data = fetch_data_for_list(INDIAN_TICKERS)
    global_data = fetch_data_for_list(GLOBAL_TICKERS)
    
    return {
        "indian": indian_data,
        "global": global_data
    }

def get_global_indices():
    """
    Fetches major global market indices.
    """
    # ^NSEI: Nifty 50, ^BSESN: Sensex, ^GSPC: S&P 500, ^IXIC: Nasdaq, ^DJI: Dow Jones, ^FTSE: FTSE 100
    indices = {
        "^NSEI": "Nifty 50",
        "^BSESN": "Sensex",
        "^GSPC": "S&P 500",
        "^IXIC": "Nasdaq",
        "^DJI": "Dow Jones",
        "^FTSE": "FTSE 100"
    }
    
    return fetch_data_for_list(list(indices.keys()))

def get_sector_performance():
    """
    Fetches performance of major Indian sectors.
    """
    # Yahoo Finance tickers for NSE Sectors often follow format like ^CNXIT (Nifty IT)
    # Note: Ticker availability varies. 
    sectors = {
        "^CNXIT": "Nifty IT",
        "^NSEBANK": "Bank Nifty",
        "^CNXAUTO": "Nifty Auto", 
        "^CNXPHARMA": "Nifty Pharma",
        "^CNXFMCG": "Nifty FMCG",
        "^CNXMETAL": "Nifty Metal",
        "^CNXENERGY": "Nifty Energy"
    }
    
    results = fetch_data_for_list(list(sectors.keys()))
    
    # Map symbols back to readable names
    for item in results:
        symbol = item['symbol']
        # Reverse lookup or just map
        # Item symbol might be clean, fetch_data_for_list cleans .NS but indices usually start with ^
        # Let's fix the symbol mapping.
        # fetch_data_for_list returns 'symbol' as the ticker key.
        
        # Mapping logic:
        # We need to preserve the original key to map to name, or just attach name during fetch.
        # But fetch_data_for_list is generic.
        
        # Let's just iterate and match.
        full_symbol = item['symbol']
        # If fetch_data strips something? It strips .NS. Indices don't have .NS usually.
        
        # Correctly map:
        if full_symbol in sectors:
            item['name'] = sectors[full_symbol]
        elif "^" + full_symbol in sectors:
             item['name'] = sectors["^" + full_symbol]
        else:
             item['name'] = full_symbol
             
    # Sort by performance
    results.sort(key=lambda x: x['change_percent'], reverse=True)
    return results

def get_market_snapshot():
    """
    Returns Gainers, Losers, Most Active (Volume), Most Active (Value).
    Using INDIAN_TICKERS for now as it's the primary market focus.
    """
    data = fetch_data_for_list(INDIAN_TICKERS)
    
    # Gainers: Change % > 0, desc
    gainers = sorted([x for x in data if x['change_percent'] > 0], key=lambda x: x['change_percent'], reverse=True)[:50]
    
    # Losers: Change % < 0, asc
    losers = sorted([x for x in data if x['change_percent'] < 0], key=lambda x: x['change_percent'])[:50]
    
    # Most Active (Volume)
    active_vol = sorted(data, key=lambda x: x['volume'], reverse=True)[:50]
    
    # Most Active (Value) = Price * Volume
    # We use a rough approximation since we don't have exact turnover, but P * V is standard proxy
    active_val = sorted(data, key=lambda x: x['price'] * x['volume'], reverse=True)[:50]
    
    return {
        "gainers": gainers,
        "losers": losers,
        "active_volume": active_vol,
        "active_value": active_val
    }
