import os
import mongomock
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/safehub")
print("⚠️ Using mongomock for in-memory database storage")
client = mongomock.MongoClient(MONGO_URI)
db = client.get_default_database()

# Collections
users_collection = db["users"]
sos_collection = db["sos_alerts"]
donors_collection = db["donors"]
