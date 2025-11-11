from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.errors import ConnectionFailure, OperationFailure
from typing import List, Dict, Any, Optional
from bson import ObjectId
import os
from dotenv import load_dotenv
import time

load_dotenv()

MONGODB_HOST = os.getenv("MONGODB_HOST", "localhost")
MONGODB_PORT = int(os.getenv("MONGODB_PORT", 27017))
MONGODB_USERNAME = os.getenv("MONGODB_USERNAME", "admin")
MONGODB_PASSWORD = os.getenv("MONGODB_PASSWORD", "admin123")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "energy_efficiency")
MONGODB_AUTH_SOURCE = os.getenv("MONGODB_AUTH_SOURCE", "admin")

MONGODB_URL = os.getenv("MONGODB_URL")
if not MONGODB_URL:
    MONGODB_URL = f"mongodb://{MONGODB_USERNAME}:{MONGODB_PASSWORD}@{MONGODB_HOST}:{MONGODB_PORT}/?authSource={MONGODB_AUTH_SOURCE}&directConnection=true"
elif "authSource" not in MONGODB_URL:
    if "?" in MONGODB_URL:
        MONGODB_URL += f"&authSource={MONGODB_AUTH_SOURCE}&directConnection=true"
    else:
        MONGODB_URL += f"?authSource={MONGODB_AUTH_SOURCE}&directConnection=true"
elif "directConnection" not in MONGODB_URL:
    MONGODB_URL += "&directConnection=true"


class Database:
    def __init__(self):
        self.client = None
        self.db = None
        self.collection_name = "efficiency_calculations"
        
    def connect(self):
        max_retries = 3
        retry_delay = 2
        
        for attempt in range(max_retries):
            try:
                self.client = MongoClient(
                    host=MONGODB_HOST,
                    port=MONGODB_PORT,
                    username=MONGODB_USERNAME,
                    password=MONGODB_PASSWORD,
                    authSource=MONGODB_AUTH_SOURCE,
                    authMechanism='SCRAM-SHA-256',
                    directConnection=True,
                    serverSelectionTimeoutMS=10000,
                    connectTimeoutMS=10000
                )
                self.db = self.client[MONGODB_DB_NAME]
                self.client.admin.command('ping')
                self._create_indexes()
                return
            except ConnectionFailure as e:
                if attempt < max_retries - 1:
                    time.sleep(retry_delay)
                    continue
                raise ConnectionFailure(
                    f"Failed to connect to MongoDB at {MONGODB_HOST}:{MONGODB_PORT} after {max_retries} attempts. "
                    f"Make sure MongoDB is running: docker-compose up -d"
                ) from e
            except OperationFailure as e:
                if attempt < max_retries - 1:
                    time.sleep(retry_delay)
                    continue
                raise OperationFailure(
                    f"MongoDB authentication failed. "
                    f"Credentials: username={MONGODB_USERNAME}, authSource={MONGODB_AUTH_SOURCE}. "
                    f"URL: mongodb://{MONGODB_USERNAME}:***@{MONGODB_HOST}:{MONGODB_PORT}/{MONGODB_DB_NAME}?authSource={MONGODB_AUTH_SOURCE}. "
                    f"Make sure MongoDB is running and initialized: docker-compose up -d"
                ) from e
            except Exception as e:
                if attempt < max_retries - 1:
                    time.sleep(retry_delay)
                    continue
                raise Exception(
                    f"Unexpected error connecting to MongoDB: {str(e)}. "
                    f"Make sure MongoDB is running: docker-compose up -d"
                ) from e
            
    def disconnect(self):
        if self.client:
            self.client.close()
            
    def _create_indexes(self):
        try:
            collection = self.db[self.collection_name]
            collection.create_index([("building_id", ASCENDING)])
            collection.create_index([
                ("building_id", ASCENDING),
                ("periods.period", ASCENDING)
            ])
            collection.create_index([("created_at", DESCENDING)])
        except Exception:
            pass
        
    def insert_calculation(self, calculation_data: Dict[str, Any]) -> str:
        try:
            collection = self.db[self.collection_name]
            result = collection.insert_one(calculation_data)
            return str(result.inserted_id)
        except OperationFailure as e:
            raise
            
    def find_by_building_id(self, building_id: str) -> List[Dict[str, Any]]:
        try:
            collection = self.db[self.collection_name]
            cursor = collection.find(
                {"building_id": building_id}
            ).sort("created_at", DESCENDING)
            
            results = []
            for doc in cursor:
                doc["_id"] = str(doc["_id"])
                results.append(doc)
            return results
        except OperationFailure as e:
            raise
            
    def find_by_building_and_period(
        self, 
        building_id: str, 
        period: str
    ) -> List[Dict[str, Any]]:
        try:
            collection = self.db[self.collection_name]
            cursor = collection.find({
                "building_id": building_id,
                "periods.period": period
            }).sort("created_at", DESCENDING)
            
            results = []
            for doc in cursor:
                doc["_id"] = str(doc["_id"])
                doc["periods"] = [p for p in doc["periods"] if p["period"] == period]
                results.append(doc)
            return results
        except OperationFailure as e:
            raise
            
    def get_building_summary(self, building_id: str) -> Optional[Dict[str, Any]]:
        try:
            collection = self.db[self.collection_name]
            result = collection.find_one(
                {"building_id": building_id},
                sort=[("created_at", DESCENDING)]
            )
            
            if result:
                result["_id"] = str(result["_id"])
            return result
        except OperationFailure as e:
            raise


db = Database()
