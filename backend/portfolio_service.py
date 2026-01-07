from .database import get_database
from .models import PortfolioItem, PortfolioUpdate
from .heatmap_service import fetch_data_for_list
import asyncio

async def get_portfolio(user_id: str):
    db = get_database()
    cursor = db.portfolio.find({"user_id": user_id})
    items = await cursor.to_list(length=100)
    
    # Helper to clean _id
    for item in items:
        item["_id"] = str(item["_id"])
        
    # Enrich with Current Market Price (CMP) to calculate P&L
    if not items:
        return []
        
    symbols = [item["symbol"] for item in items]
    
    # Fetch live prices (using fetch_data_for_list from heatmap_service is handy!)
    # Ideally should handle this more robustly, but reusing existing logic is efficient.
    # Note: fetch_data_for_list assumes standard list input.
    
    try:
        # We need a robust fetcher. Let's reuse fetch_data_for_list but it formats for heatmap.
        # It yields {symbol, price, change_percent}. That's exactly what we need.
        live_data = fetch_data_for_list(symbols)
        
        # Create map for quick lookup
        price_map = {d["symbol"]: d for d in live_data}
        
        # Merge
        for item in items:
            # heatmap_service cleans .NS from display symbol, but returns it in the data I think?
            # actually fetch_data_for_list returns cleaned symbol in "symbol" key.
            # So if we stored "RELIANCE.NS", fetcher returns "RELIANCE".
            # We need to handle this key mismatch.
            
            # Simple fix: check both exact and cleaned keys
            clean_sym = item["symbol"].replace(".NS", "").replace(".BO", "")
            
            market_info = None
            
            # Try finding by exact match or cleaned match
            for m in live_data:
                if m["symbol"] == item["symbol"] or m["symbol"] == clean_sym:
                    market_info = m
                    break
            
            if market_info:
                item["cmp"] = market_info["price"]
                item["change_percent"] = market_info["change_percent"]
                
                # Calculate Values
                current_val = item["quantity"] * item["cmp"]
                invested_val = item["quantity"] * item["avg_price"]
                pnl = current_val - invested_val
                pnl_pct = (pnl / invested_val) * 100 if invested_val > 0 else 0
                
                item["current_value"] = round(current_val, 2)
                item["investment_value"] = round(invested_val, 2)
                item["pnl"] = round(pnl, 2)
                item["pnl_percent"] = round(pnl_pct, 2)
            else:
                # Fallback if fetch fails
                item["cmp"] = 0
                item["current_value"] = 0
                item["pnl"] = 0
                item["pnl_percent"] = 0
                
    except Exception as e:
        print(f"Error enriching portfolio: {e}")
        
    return items

async def add_holding(item: PortfolioItem):
    db = get_database()
    # Check if exists for this user
    existing = await db.portfolio.find_one({"symbol": item.symbol, "user_id": item.user_id})
    
    if existing:
        # Weighted Average Price Logic
        old_qty = existing["quantity"]
        old_avg = existing["avg_price"]
        new_qty = item.quantity
        new_price = item.avg_price
        
        total_qty = old_qty + new_qty
        avg_price = ((old_qty * old_avg) + (new_qty * new_price)) / total_qty
        
        await db.portfolio.update_one(
            {"symbol": item.symbol, "user_id": item.user_id},
            {"$set": {"quantity": total_qty, "avg_price": round(avg_price, 2)}}
        )
        return {"message": "Holding updated", "symbol": item.symbol}
    else:
        await db.portfolio.insert_one(item.dict())
        return {"message": "Holding added", "symbol": item.symbol}

async def delete_holding(symbol: str, user_id: str):
    db = get_database()
    result = await db.portfolio.delete_one({"symbol": symbol, "user_id": user_id})
    if result.deleted_count > 0:
        return {"message": "Holding deleted"}
    return {"error": "Holding not found"}
