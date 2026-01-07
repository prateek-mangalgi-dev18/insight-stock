# mistral_client.py
import os
from dotenv import load_dotenv
from mistralai import Mistral

load_dotenv()

api_key = os.getenv("MISTRAL_API_KEY")
# assert api_key, "MISTRAL_API_KEY not set" 
# Commenting out assert to avoid crash on import if env not set immediately, 
# but functionality will fail if key is missing.

client = None
if api_key:
    client = Mistral(api_key=api_key)

def ask_mistral(prompt, model="mistral-large-latest"):
    if not client:
        return "Mistral API Key not set."
    try:
        response = client.chat.complete(
            model=model,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error contacting Mistral: {e}"
