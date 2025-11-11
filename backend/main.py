from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from typing import List
from datetime import datetime
import os
from dotenv import load_dotenv

from models import CalculationRequest, CalculationResponse, ErrorResponse
from calculations import process_efficiency_calculation
from database import db

load_dotenv()

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")


@asynccontextmanager
async def lifespan(app: FastAPI):
    db.connect()
    yield
    db.disconnect()


app = FastAPI(
    title="Energy Efficiency Tracker API",
    description="API for tracking and calculating energy efficiency improvements in buildings",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "Energy Efficiency Tracker API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/health", tags=["Health"])
async def health_check():
    try:
        db.client.admin.command('ping')
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unhealthy",
                "database": "disconnected",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
        )


@app.post(
    "/api/efficiency/calculate",
    response_model=CalculationResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Efficiency Calculations"]
)
async def calculate_efficiency(request: CalculationRequest):
    try:
        calculation_result = process_efficiency_calculation(request.model_dump())
        inserted_id = db.insert_calculation(calculation_result)
        calculation_result["_id"] = inserted_id
        return CalculationResponse(**calculation_result)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Validation error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process calculation: {str(e)}"
        )


@app.get(
    "/api/efficiency/building/{building_id}",
    response_model=List[CalculationResponse],
    tags=["Efficiency Calculations"]
)
async def get_building_calculations(building_id: str):
    try:
        results = db.find_by_building_id(building_id)
        if not results:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No calculations found for building ID: {building_id}"
            )
        return [CalculationResponse(**result) for result in results]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve calculations: {str(e)}"
        )


@app.get(
    "/api/efficiency/building/{building_id}/period/{period}",
    response_model=List[CalculationResponse],
    tags=["Efficiency Calculations"]
)
async def get_building_period_calculations(building_id: str, period: str):
    valid_periods = ["business_hours", "after_hours", "weekend"]
    if period not in valid_periods:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid period. Must be one of: {', '.join(valid_periods)}"
        )
    
    try:
        results = db.find_by_building_and_period(building_id, period)
        if not results:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No calculations found for building ID: {building_id} and period: {period}"
            )
        return [CalculationResponse(**result) for result in results]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve calculations: {str(e)}"
        )


@app.get(
    "/api/efficiency/building/{building_id}/summary",
    response_model=CalculationResponse,
    tags=["Efficiency Calculations"]
)
async def get_building_summary(building_id: str):
    try:
        result = db.get_building_summary(building_id)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No summary found for building ID: {building_id}"
            )
        return CalculationResponse(**result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve summary: {str(e)}"
        )


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            error="Internal Server Error",
            detail=str(exc)
        ).model_dump()
    )


if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", 8000))
    reload = os.getenv("API_RELOAD", "true").lower() == "true"
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=reload
    )

