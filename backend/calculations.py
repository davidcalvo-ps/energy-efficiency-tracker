from typing import List, Dict, Any
from datetime import datetime, timezone
from models import PeriodInput, PeriodMetrics, EfficiencySummary


def calculate_period_metrics(period: PeriodInput) -> PeriodMetrics:
    electric_savings_kwh = period.baseline_electric_kwh - period.current_electric_kwh
    gas_savings_therms = period.baseline_gas_therms - period.current_gas_therms
    
    electric_cost_savings = electric_savings_kwh * period.electric_rate
    gas_cost_savings = gas_savings_therms * period.gas_rate
    total_cost_savings = electric_cost_savings + gas_cost_savings
    
    electric_efficiency_improvement_percent = (
        (electric_savings_kwh / period.baseline_electric_kwh) * 100
        if period.baseline_electric_kwh > 0 else 0
    )
    
    gas_efficiency_improvement_percent = (
        (gas_savings_therms / period.baseline_gas_therms) * 100
        if period.baseline_gas_therms > 0 else 0
    )
    
    baseline_electric_cost = period.baseline_electric_kwh * period.electric_rate
    baseline_gas_cost = period.baseline_gas_therms * period.gas_rate
    total_baseline_cost = baseline_electric_cost + baseline_gas_cost
    
    overall_efficiency_improvement_percent = (
        (total_cost_savings / total_baseline_cost) * 100
        if total_baseline_cost > 0 else 0
    )
    
    performance_grade = calculate_performance_grade(overall_efficiency_improvement_percent)
    
    return PeriodMetrics(
        period=period.period,
        time_range=period.time_range,
        days=period.days,
        current_electric_kwh=period.current_electric_kwh,
        current_gas_therms=period.current_gas_therms,
        baseline_electric_kwh=period.baseline_electric_kwh,
        baseline_gas_therms=period.baseline_gas_therms,
        electric_savings_kwh=round(electric_savings_kwh, 2),
        gas_savings_therms=round(gas_savings_therms, 2),
        electric_cost_savings=round(electric_cost_savings, 2),
        gas_cost_savings=round(gas_cost_savings, 2),
        total_cost_savings=round(total_cost_savings, 2),
        electric_efficiency_improvement_percent=round(electric_efficiency_improvement_percent, 2),
        gas_efficiency_improvement_percent=round(gas_efficiency_improvement_percent, 2),
        overall_efficiency_improvement_percent=round(overall_efficiency_improvement_percent, 2),
        performance_grade=performance_grade
    )


def calculate_summary(periods: List[PeriodMetrics]) -> EfficiencySummary:
    total_electric_savings_kwh = sum(p.electric_savings_kwh for p in periods)
    total_gas_savings_therms = sum(p.gas_savings_therms for p in periods)
    total_cost_savings = sum(p.total_cost_savings for p in periods)
    
    average_efficiency_improvement_percent = (
        sum(p.overall_efficiency_improvement_percent for p in periods) / len(periods)
        if periods else 0
    )
    
    overall_performance_grade = calculate_performance_grade(average_efficiency_improvement_percent)
    
    if periods:
        best_performing_period = max(periods, key=lambda p: p.overall_efficiency_improvement_percent).period
        worst_performing_period = min(periods, key=lambda p: p.overall_efficiency_improvement_percent).period
    else:
        best_performing_period = ""
        worst_performing_period = ""
    
    return EfficiencySummary(
        total_electric_savings_kwh=round(total_electric_savings_kwh, 2),
        total_gas_savings_therms=round(total_gas_savings_therms, 2),
        total_cost_savings=round(total_cost_savings, 2),
        average_efficiency_improvement_percent=round(average_efficiency_improvement_percent, 2),
        overall_performance_grade=overall_performance_grade,
        best_performing_period=best_performing_period,
        worst_performing_period=worst_performing_period
    )


def calculate_performance_grade(efficiency_improvement_percent: float) -> str:
    if efficiency_improvement_percent >= 20:
        return "A+ (Excellent)"
    elif efficiency_improvement_percent >= 15:
        return "A (Very Good)"
    elif efficiency_improvement_percent >= 10:
        return "B+ (Good)"
    elif efficiency_improvement_percent >= 5:
        return "B (Satisfactory)"
    elif efficiency_improvement_percent >= 0:
        return "C (Needs Improvement)"
    else:
        return "D (Poor)"


def process_efficiency_calculation(request_data: Dict[str, Any]) -> Dict[str, Any]:
    building_id = request_data["building_id"]
    measure_name = request_data["measure_name"]
    periods_data = request_data["periods"]
    
    periods = [PeriodInput(**period) for period in periods_data]
    period_metrics = [calculate_period_metrics(period) for period in periods]
    summary = calculate_summary(period_metrics)
    calculation_timestamp = datetime.now(timezone.utc)
    
    return {
        "building_id": building_id,
        "measure_name": measure_name,
        "calculation_timestamp": calculation_timestamp,
        "periods": [metric.model_dump() for metric in period_metrics],
        "summary": summary.model_dump(),
        "created_at": calculation_timestamp
    }

