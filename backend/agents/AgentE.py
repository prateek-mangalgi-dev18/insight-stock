from .mistral_client import ask_mistral

class AgentE:
    def write_summary(self, market, fundamentals, risk):
        # Detect currency
        symbol = market.get("symbol", "")
        currency = "INR" if ".ns" in symbol.lower() or ".bo" in symbol.lower() else "USD"
        
        prompt = f"""
        Write a concise stock summary for an Indian investor.
        RULES:
        - Neutral tone
        - Use {currency} for all monetary values. DO NOT use $ unless the stock is US-based.
        - No questions
        - No calls to action
        - No suggestions for further analysis
        - MUST include the P/E Ratio.
        - Provide valuation context (P/E vs Sector/Peers).
        - End with a concluding statement

        Market data: {market}
        Fundamental analysis: {fundamentals}
        Risk assessment: {risk}

        Tone: professional, neutral, short.
        FORMATTING RULES (Strict):
        - Use '## ' for section headers (e.g. ## Market Outlook).
        - Use '- ' for bullet points.
        - Do NOT number the headers.
        - Do NOT use bold (**text**) for headers, use ## instead.
        """

        return ask_mistral(prompt)
