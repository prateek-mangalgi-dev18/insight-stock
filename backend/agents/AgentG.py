from .AgentA import AgentA
from .AgentB import AgentB
from .AgentC import AgentC
from .AgentD import AgentD
from .AgentE import AgentE
from .AgentF import AgentF


class AgentG:
    def generate_report(self, symbol, period="6mo"):
        # 1. Market Data
        try:
            market = AgentA().get_market_snapshot(symbol, period)
        except Exception as e:
            return {"error": str(e)}

        # 2. Parallelize or sequential fetch? Sequential for now as per original.
        fundamentals = AgentC().analyze_fundamentals(symbol)
        risk = AgentD().assess_risk(symbol)
        news = AgentB().fetch_news(symbol)

        # 3. Write Summary
        summary = AgentE().write_summary(market, fundamentals, risk)
        
        # 4. Critique
        critique = AgentF().critique(summary)
        
        return {
            "symbol": symbol,
            "market_data": market,
            "fundamentals": fundamentals,
            "risk": risk,
            "news": news,
            "summary": summary,
            "critique": critique
        }
