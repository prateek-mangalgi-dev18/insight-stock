# AgentA.py
import yfinance as yf
from datetime import datetime
import pytz

class AgentA:
    def _is_market_open(self, symbol: str, data_timestamp: datetime) -> bool:
        """
        Determine if the market is currently open based on symbol and current time.
        Returns True if market is open, False otherwise.
        """
        # Determine market timezone based on symbol
        is_indian = symbol.upper().endswith('.NS') or symbol.upper().endswith('.BO')
        
        if is_indian:
            # Indian market: NSE/BSE
            # Trading hours: 9:15 AM - 3:30 PM IST, Monday-Friday
            tz = pytz.timezone('Asia/Kolkata')
            market_open_hour = 9
            market_open_minute = 15
            market_close_hour = 15
            market_close_minute = 30
        else:
            # US market: NYSE/NASDAQ
            # Trading hours: 9:30 AM - 4:00 PM EST, Monday-Friday
            tz = pytz.timezone('US/Eastern')
            market_open_hour = 9
            market_open_minute = 30
            market_close_hour = 16
            market_close_minute = 0
        
        # Get current time in market timezone
        now = datetime.now(tz)
        
        # Check if it's a weekday (Monday=0, Sunday=6)
        if now.weekday() >= 5:  # Saturday or Sunday
            return False
        
        # Check if current time is within market hours
        current_time = now.time()
        market_open = datetime.strptime(f"{market_open_hour}:{market_open_minute}", "%H:%M").time()
        market_close = datetime.strptime(f"{market_close_hour}:{market_close_minute}", "%H:%M").time()
        
        return market_open <= current_time <= market_close
    
    def get_market_snapshot(self, symbol: str, period: str = "6mo"):
        valid_periods = ["5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"]
        if period not in valid_periods:
            period = "6mo" # Fallback
            
        ticker = yf.Ticker(symbol)
        try:
            hist = ticker.history(period=period)
        except Exception as e:
            print(f"Error fetching history for {symbol}: {e}")
            hist = ticker.history(period="6mo") # Fallback on error

        if hist.empty:
            raise ValueError(f"No data for {symbol}")

        latest = hist.iloc[-1]
        
        # Get the actual timestamp from the last data point
        last_data_date = hist.index[-1]
        
        # Determine market timezone and closing time based on symbol
        is_indian = symbol.upper().endswith('.NS') or symbol.upper().endswith('.BO')
        
        if is_indian:
            # Indian market: NSE/BSE closes at 3:30 PM IST
            tz = pytz.timezone('Asia/Kolkata')
            close_hour = 15
            close_minute = 30
        else:
            # US market: NYSE/NASDAQ closes at 4:00 PM EST
            tz = pytz.timezone('US/Eastern')
            close_hour = 16
            close_minute = 0
        
        # Convert the date to the market timezone and set to market closing time
        # yfinance returns dates at midnight, so we need to set the correct closing time
        if last_data_date.tzinfo is None:
            # Create a timezone-aware datetime at market close
            data_timestamp = tz.localize(
                last_data_date.replace(hour=close_hour, minute=close_minute, second=0, microsecond=0)
            )
        else:
            # Convert to market timezone and set to market close time
            data_timestamp = last_data_date.astimezone(tz).replace(
                hour=close_hour, minute=close_minute, second=0, microsecond=0
            )
        
        # Check if market is currently open
        is_market_open = self._is_market_open(symbol, data_timestamp)
        
        # Process history for graph
        history_data = []
        for date, row in hist.iterrows():
            history_data.append({
                "date": date.strftime("%Y-%m-%d"),
                "open": float(row["Open"]),
                "high": float(row["High"]),
                "low": float(row["Low"]),
                "close": float(row["Close"]),
                "volume": int(row["Volume"])
            })

        return {
            "symbol": symbol,
            "timestamp": data_timestamp.isoformat(),
            "is_market_open": is_market_open,
            "price": float(latest["Close"]),
            "ohlc": {
                "open": float(latest["Open"]),
                "high": float(latest["High"]),
                "low": float(latest["Low"]),
                "close": float(latest["Close"]),
                "volume": int(latest["Volume"])
            },
            "marketCap": ticker.info.get("marketCap"),
            "peRatio": ticker.info.get("trailingPE"),
            "forwardPE": ticker.info.get("forwardPE"),
            "pegRatio": ticker.info.get("pegRatio"),
            "sector": ticker.info.get("sector"),
            "exDividendDate": ticker.info.get("exDividendDate"),
            "beta": ticker.info.get("beta"),
            "exchange": ticker.info.get("exchange"),
            "name": ticker.info.get("shortName", ticker.info.get("longName", symbol)),
            "history": history_data
        }
