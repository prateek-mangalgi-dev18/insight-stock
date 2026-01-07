from .AgentA import AgentA
from .mistral_client import ask_mistral

class AgentD:
    def assess_risk(self, symbol):
        data = AgentA().get_market_snapshot(symbol)

        vol = (data["ohlc"]["high"] - data["ohlc"]["low"]) / data["ohlc"]["close"]

        prompt = f"""
        Volatility: {vol:.2%}
        Classify risk as: Low, Medium, High.
        Output ONLY one word.
        """

        raw_text = ask_mistral(prompt)
        
        # Post-process to ensure single word
        import re
        match = re.search(r"(Low|Medium|High)", raw_text, re.IGNORECASE)
        risk_text = match.group(0).capitalize() if match else "Medium"

        return {
            "symbol": symbol,
            "volatility": round(vol, 4),
            "risk_assessment": risk_text
        }
