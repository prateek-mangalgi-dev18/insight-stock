from .AgentA import AgentA
from .mistral_client import ask_mistral

class AgentC:
    def analyze_fundamentals(self, symbol):
        data = AgentA().get_market_snapshot(symbol)

        prompt = f"""
        Analyze the valuation of the stock using this data:
        Price: {data['price']}
        Market Cap: {data['marketCap']}
        Exchange: {data['exchange']}

        Respond with:
        - Valuation (Overvalued/Fair/Undervalued)
        - One sentence justification
        """

        analysis = ask_mistral(prompt)

        return {
            "symbol": symbol,
            "analysis": analysis
        }
