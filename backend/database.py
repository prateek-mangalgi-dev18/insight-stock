from motor.motor_asyncio import AsyncIOMotorClient
import os

# Default to local if not specified
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "stock_ai_db_feedback"

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

def get_database():
    return db
