from typing import List, Literal
from pydantic import BaseModel, Field, field_validator, ConfigDict
from datetime import datetime, timezone
from bson import ObjectId


class PeriodInput(BaseModel):
    period: Literal["business_hours", "after_hours", "weekend"]
    time_range: str
    days: List[str] = Field(..., min_length=1)
    current_electric_kwh: float = Field(..., gt=0)
    current_gas_therms: float = Field(..., gt=0)
    baseline_electric_kwh: float = Field(..., gt=0)
    baseline_gas_therms: float = Field(..., gt=0)
    electric_rate: float = Field(..., gt=0)
    gas_rate: float = Field(..., gt=0)

    @field_validator('days')
    @classmethod
    def validate_days(cls, v):
        valid_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        for day in v:
            if day not in valid_days:
                raise ValueError(f"Invalid day: {day}. Must be one of {valid_days}")
        return v


class CalculationRequest(BaseModel):
    building_id: str
    measure_name: str = Field(..., min_length=1)
    periods: List[PeriodInput] = Field(..., min_length=1, max_length=10)

    @field_validator('building_id')
    @classmethod
    def validate_building_id(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid building_id format. Must be a valid ObjectId")
        return v


class PeriodMetrics(BaseModel):
    period: str
    time_range: str
    days: List[str]
    current_electric_kwh: float
    current_gas_therms: float
    baseline_electric_kwh: float
    baseline_gas_therms: float
    electric_savings_kwh: float
    gas_savings_therms: float
    electric_cost_savings: float
    gas_cost_savings: float
    total_cost_savings: float
    electric_efficiency_improvement_percent: float
    gas_efficiency_improvement_percent: float
    overall_efficiency_improvement_percent: float
    performance_grade: str


class EfficiencySummary(BaseModel):
    total_electric_savings_kwh: float
    total_gas_savings_therms: float
    total_cost_savings: float
    average_efficiency_improvement_percent: float
    overall_performance_grade: str
    best_performing_period: str
    worst_performing_period: str


class CalculationResponse(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={ObjectId: str}
    )
    
    id: str = Field(..., alias="_id")
    building_id: str
    measure_name: str
    calculation_timestamp: datetime
    periods: List[PeriodMetrics]
    summary: EfficiencySummary
    created_at: datetime


class ErrorResponse(BaseModel):
    error: str
    detail: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

