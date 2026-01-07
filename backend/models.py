from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class User(BaseModel):
    username: str
    email: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

class UserRegister(BaseModel):
    username: str
    email: Optional[str] = None
    password: str

class PortfolioItemCreate(BaseModel):
    symbol: str
    quantity: int
    avg_price: float
    purchase_date: Optional[str] = None
    sector: Optional[str] = "Unknown"

    class Config:
        json_schema_extra = {
            "example": {
                "symbol": "RELIANCE.NS",
                "quantity": 10,
                "avg_price": 2450.50,
                "purchase_date": "2023-10-01",
                "sector": "Energy"
            }
        }

class PortfolioItem(PortfolioItemCreate):
    user_id: str  # Link to User

class PortfolioUpdate(BaseModel):
    quantity: Optional[int] = None
    avg_price: Optional[float] = None
