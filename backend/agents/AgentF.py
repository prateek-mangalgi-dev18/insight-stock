from .mistral_client import ask_mistral

class AgentF:
    def critique(self, summary_text):
        prompt = f"""
        Analyze the following stock summary and provide a definitive valuation critique.
        
        CRITIQUE OBJECTIVE:
        Act as a senior equity analyst. You must evaluate the provided P/E Ratio against broader sector norms and historical data to conclude if the stock is Overvalued, Undervalued, or Fairly Valued.

        IMPORTANT RULES:
        - Do NOT ask rhetorical questions. 
        - Provide direct analysis and conclusions based on the data provided.
        - Use ## for headers and - for bullet points.
        - Do NOT use bold (**text**) inside headers.

        CRITIQUE GUIDELINES:
        1. ## Valuation Analysis
        - Identify the P/E Ratio in the text. If missing, flag it as a critical failure.
        - Compare the P/E to the sector average (approximate based on current market context).
        - Explicitly state if the stock is "Overvalued" or "Undervalued" based on this comparison.
        
        2. ## Metric Verification
        - Validate ROI, Debt/Equity, and Margins. 
        - If "strong growth" is claimed without a PEG ratio or margin expansion data, label the claim as "unsubstantiated."

        3. ## Risk and Bias Assessment
        - Identify "bullish bias." 
        - Specifically point out if the summary ignores sector saturation or rising interest rate impacts on debt.

        Summary:
        {summary_text}
        """

        return ask_mistral(prompt)