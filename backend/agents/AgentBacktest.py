from .mistral_client import ask_mistral

class AgentBacktest:
    def analyze_results(self, result):
        """
        Analyzes the result of a backtest and generates a critique/summary.
        """
        symbol = result.get("symbol", "Unknown")
        strategy = result.get("strategy", "Unknown")
        total_return = result.get("total_return_pct", 0)
        max_drawdown = result.get("max_drawdown_pct", 0)
        final_equity = result.get("final_equity", 0)
        initial_capital = result.get("initial_capital", 0)

        # Determine Currency Symbol
        currency_symbol = "₹" if (symbol.upper().endswith(".NS") or symbol.upper().endswith(".BO")) else "$"
        
        prompt = f"""
        You are an expert Quantitative Trading Analyst.
        Review the following backtest results for {symbol} using the {strategy} strategy.

        STATS:
        - Initial Capital: {currency_symbol}{initial_capital}
        - Final Equity: {currency_symbol}{final_equity}
        - Total Return: {total_return}%
        - Max Drawdown: {max_drawdown}%

        TASK:
        Provide a brief, professional assessment of this strategy's performance.
        - Was it profitable?
        - Was the risk (drawdown) acceptable regarding the return?
        - Suggest one improvement or alternative to consider.
        
        Keep it under 100 words. Neutral tone. No financial advice disclaimer needed as this is a simulation tool.
        """
        
        try:
            analysis = ask_mistral(prompt)
            return analysis
        except Exception as e:
            return f"AI Analysis failed: {str(e)}"
