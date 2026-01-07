import yfinance as yf
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from plotly.subplots import make_subplots

class BacktestEngine:
    def __init__(self, commission_pct=0.001):
        """
        commission_pct: 0.001 represents a 0.1% fee per trade.
        """
        self.commission = commission_pct

    def run_backtest(self, symbol: str, strategy: str, initial_capital: float = 10000.0, period: str = "2y"):
        try:
            # 1. Fetch High-Fidelity Data
            df = yf.download(symbol, period=period, progress=False)
            if df.empty:
                return {"error": f"No data found for {symbol}"}
            
            # Standardize column headers (Fixes yfinance MultiIndex issues)
            if isinstance(df.columns, pd.MultiIndex):
                df.columns = df.columns.get_level_values(0)
            
            df = df.ffill().dropna()
            data = df.copy()

            # 2. Strategy Logic (Calculating Signals)
            data['Signal'] = 0

            if strategy == "SMA_Crossover":
                data['SMA_Short'] = data['Close'].rolling(window=20).mean()
                data['SMA_Long'] = data['Close'].rolling(window=50).mean()
                data['Signal'] = np.where(data['SMA_Short'] > data['SMA_Long'], 1, 0)

            elif strategy == "RSI":
                delta = data['Close'].diff()
                gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
                loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
                rs = gain / loss
                data['RSI'] = 100 - (100 / (1 + rs))
                # Stateful Logic: Buy < 30, Sell > 70
                state = 0
                signals = []
                for rsi in data['RSI']:
                    if rsi < 30: state = 1
                    elif rsi > 70: state = 0
                    signals.append(state)
                data['Signal'] = signals

            elif strategy == "MACD":
                exp1 = data['Close'].ewm(span=12, adjust=False).mean()
                exp2 = data['Close'].ewm(span=26, adjust=False).mean()
                data['MACD'] = exp1 - exp2
                data['Signal_Line'] = data['MACD'].ewm(span=9, adjust=False).mean()
                data['Signal'] = np.where(data['MACD'] > data['Signal_Line'], 1, 0)

            elif strategy == "Bollinger_Bands":
                data['MA20'] = data['Close'].rolling(window=20).mean()
                data['STD20'] = data['Close'].rolling(window=20).std()
                data['Upper'] = data['MA20'] + (data['STD20'] * 2)
                data['Lower'] = data['MA20'] - (data['STD20'] * 2)
                state = 0
                signals = []
                for p, l, u in zip(data['Close'], data['Lower'], data['Upper']):
                    if p < l: state = 1
                    elif p > u: state = 0
                    signals.append(state)
                data['Signal'] = signals

            # 3. Market Simulation (Realistic Execution)
            # Signal shift ensures we trade at next day's OPEN (No look-ahead bias)
            data['Position'] = data['Signal'].shift(1).fillna(0)
            
            cash = initial_capital
            shares = 0
            equity_curve = []

            for i in range(len(data)):
                # Trade at Open price of current day
                current_open = data['Open'].iloc[i] 
                current_close = data['Close'].iloc[i]
                target_pos = data['Position'].iloc[i]
                
                # EXECUTE: BUY
                if target_pos == 1 and shares == 0:
                    shares = cash // (current_open * (1 + self.commission))
                    cash -= shares * current_open * (1 + self.commission)
                
                # EXECUTE: SELL
                elif target_pos == 0 and shares > 0:
                    cash += shares * current_open * (1 - self.commission)
                    shares = 0
                
                # Daily Equity Tracking (Based on Close price)
                current_equity = cash + (shares * current_close)
                equity_curve.append({
                    "date": data.index[i].strftime('%Y-%m-%d'),
                    "equity": round(current_equity, 2),
                    "open": float(data['Open'].iloc[i]),
                    "high": float(data['High'].iloc[i]),
                    "low": float(data['Low'].iloc[i]),
                    "close": float(data['Close'].iloc[i])
                })

            # 4. Final Analytics
            equity_series = pd.Series([e['equity'] for e in equity_curve])
            final_equity = equity_series.iloc[-1]
            total_return = ((final_equity - initial_capital) / initial_capital) * 100
            rolling_max = equity_series.cummax()
            max_dd = ((equity_series - rolling_max) / rolling_max).min() * 100

            return {
                "symbol": symbol,
                "strategy": strategy,
                "initial_capital": initial_capital, 
                "final_equity": round(final_equity, 2),
                "total_return_pct": round(total_return, 2),
                "max_drawdown_pct": round(max_dd, 2),
                "equity_curve": equity_curve
            }

        except Exception as e:
            return {"error": str(e)}

def plot_results(results):
    if "error" in results:
        print(f"Error: {results['error']}")
        return

    df_res = pd.DataFrame(results['equity_curve'])
    df_res['date'] = pd.to_datetime(df_res['date'])

    # Create layout for Price (Candlestick) and Equity Curve
    fig = make_subplots(
        rows=2, cols=1, 
        shared_xaxes=True, 
        vertical_spacing=0.08,
        subplot_titles=(f"{results['symbol']} Price Variance", "Portfolio Equity Curve"),
        row_heights=[0.6, 0.4]
    )

    # 1. Price Variance Chart (Candlesticks show the high/low/open/close - no straight lines)
    
    fig.add_trace(
        go.Candlestick(
            x=df_res['date'],
            open=df_res['open'],
            high=df_res['high'],
            low=df_res['low'],
            close=df_res['close'],
            name="Market Price"
        ), row=1, col=1
    )

    # 2. Equity Curve Chart
    fig.add_trace(
        go.Scatter(
            x=df_res['date'], 
            y=df_res['equity'], 
            name="Total Equity",
            fill='tozeroy',
            line=dict(color='royalblue', width=2)
        ), row=2, col=1
    )

    # Update Layout & Formatting
    fig.update_layout(
        height=800,
        template="plotly_dark",
        title_text=f"Backtest Analysis: {results['symbol']} | Return: {results['total_return_pct']}% | Max DD: {results['max_drawdown_pct']}%",
        xaxis_rangeslider_visible=False,
        showlegend=True
    )

    fig.show()

# --- RUNNING THE SYSTEM ---
if __name__ == "__main__":
    engine = BacktestEngine(commission_pct=0.001) # 0.1% commission
    results = engine.run_backtest("NVDA", "SMA_Crossover", period="2y")
    plot_results(results)