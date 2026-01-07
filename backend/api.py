from fastapi import APIRouter, HTTPException
import httpx
from pydantic import BaseModel
from .agents.AgentG import AgentG
from .backtest_engine import BacktestEngine
from .heatmap_service import get_market_heatmap, get_global_indices, get_sector_performance, get_market_snapshot
from .agents.AgentBacktest import AgentBacktest
import yfinance as yf
from fastapi.responses import StreamingResponse
import io
from .pdf_generator import create_pdf_report
from .database import get_database
from datetime import datetime

router = APIRouter()

class FeedbackModel(BaseModel):
    name: str
    email: str
    type: str
    message: str

@router.post("/feedback")
async def submit_feedback(feedback: FeedbackModel):
    try:
        db = get_database()
        document = feedback.dict()
        document['timestamp'] = datetime.utcnow()
        await db.feedback.insert_one(document)
        return {"status": "success", "message": "Feedback stored"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class StockRequest(BaseModel):
    symbol: str
    period: str = "6mo"

@router.post("/analyze")
async def analyze_stock(request: StockRequest):
    agent = AgentG()
    result = agent.generate_report(request.symbol, request.period)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.post("/report/pdf")
async def generate_pdf(report_data: dict):
    # Use the data passed from frontend directly to avoid re-running slow agents
    data = report_data
    
    symbol = data.get("market_data", {}).get("symbol", "Report")
    
    if "error" in data:
         raise HTTPException(status_code=400, detail=data["error"])

    pdf_bytes = create_pdf_report(data)
    headers = {
        'Content-Disposition': f'attachment; filename="{symbol}_report.pdf"'
    }
    return StreamingResponse(io.BytesIO(pdf_bytes), media_type="application/pdf", headers=headers)


@router.get("/search")
async def search_stocks(q: str):
    if not q or len(q) < 2:
        return {"results": []}
    
    try:
        url = "https://query1.finance.yahoo.com/v1/finance/search"
        params = {"q": q, "quotesCount": 8, "newsCount": 0}
        headers = {"User-Agent": "Mozilla/5.0"}
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, headers=headers)
            data = response.json()
            
        results = [
            {
                "name": quote.get("shortname", quote.get("longname", "Unknown")),
                "symbol": quote.get("symbol")
            }
            for quote in data.get("quotes", [])
            if quote.get("symbol")
        ]
        return {"results": results}
    except Exception as e:
        print(f"Search error: {e}")
        return {"results": []}

class BacktestRequest(BaseModel):
    symbol: str
    strategy: str = "SMA_Crossover"
    initial_capital: float = 10000.0
    period: str = "1y"

@router.post("/backtest")
async def run_backtest(request: BacktestRequest):
    engine = BacktestEngine()
    result = engine.run_backtest(
        request.symbol, 
        request.strategy, 
        request.initial_capital, 
        request.period
    )
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
        
    # AI Analysis
    try:
        analyst = AgentBacktest()
        analysis = analyst.analyze_results(result)
        result["ai_analysis"] = analysis
    except Exception as e:
        print(f"AI Analysis failed: {e}")
        result["ai_analysis"] = "AI Analysis unavailable."
        
    return result

@router.get("/heatmap")
async def get_heatmap():
    data = get_market_heatmap()
    return {"data": data}

@router.get("/market/indices")
async def get_indices():
    data = get_global_indices()
    return {"data": data}

@router.get("/market/sectors")
async def get_sectors():
    data = get_sector_performance()
    return {"data": data}

@router.get("/market/snapshot")
async def get_snapshot():
    data = get_market_snapshot()
    return {"data": data}

