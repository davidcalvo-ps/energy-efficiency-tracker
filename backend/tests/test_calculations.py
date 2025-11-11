import pytest
from datetime import datetime
from models import PeriodInput
from calculations import (
    calculate_period_metrics,
    calculate_summary,
    calculate_performance_grade,
    process_efficiency_calculation
)


class TestCalculatePeriodMetrics:
    def test_calculate_period_metrics_basic(self):
        period = PeriodInput(
            period="business_hours",
            time_range="08:00-18:00",
            days=["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            current_electric_kwh=45000,
            current_gas_therms=3200,
            baseline_electric_kwh=52000,
            baseline_gas_therms=4100,
            electric_rate=0.12,
            gas_rate=0.95
        )
        
        result = calculate_period_metrics(period)
        
        assert result.electric_savings_kwh == 7000.0
        assert result.gas_savings_therms == 900.0
        assert result.electric_cost_savings == 840.0
        assert result.gas_cost_savings == 855.0
        assert result.total_cost_savings == 1695.0
        assert result.electric_efficiency_improvement_percent == pytest.approx(13.46, rel=0.01)
        assert result.gas_efficiency_improvement_percent == pytest.approx(21.95, rel=0.01)
        assert result.overall_efficiency_improvement_percent == pytest.approx(16.72, rel=0.01)
        assert result.performance_grade == "A (Very Good)"

    def test_calculate_period_metrics_no_savings(self):
        period = PeriodInput(
            period="business_hours",
            time_range="08:00-18:00",
            days=["Monday"],
            current_electric_kwh=50000,
            current_gas_therms=4000,
            baseline_electric_kwh=50000,
            baseline_gas_therms=4000,
            electric_rate=0.12,
            gas_rate=0.95
        )
        
        result = calculate_period_metrics(period)
        
        assert result.electric_savings_kwh == 0.0
        assert result.gas_savings_therms == 0.0
        assert result.total_cost_savings == 0.0
        assert result.overall_efficiency_improvement_percent == 0.0
        assert result.performance_grade == "C (Needs Improvement)"

    def test_calculate_period_metrics_negative_savings(self):
        period = PeriodInput(
            period="business_hours",
            time_range="08:00-18:00",
            days=["Monday"],
            current_electric_kwh=55000,
            current_gas_therms=4500,
            baseline_electric_kwh=50000,
            baseline_gas_therms=4000,
            electric_rate=0.12,
            gas_rate=0.95
        )
        
        result = calculate_period_metrics(period)
        
        assert result.electric_savings_kwh == -5000.0
        assert result.gas_savings_therms == -500.0
        assert result.total_cost_savings < 0
        assert result.performance_grade == "D (Poor)"

    def test_calculate_period_metrics_very_small_baseline(self):
        period = PeriodInput(
            period="business_hours",
            time_range="08:00-18:00",
            days=["Monday"],
            current_electric_kwh=1000,
            current_gas_therms=100,
            baseline_electric_kwh=1,
            baseline_gas_therms=1,
            electric_rate=0.12,
            gas_rate=0.95
        )
        
        result = calculate_period_metrics(period)
        
        assert result.electric_efficiency_improvement_percent < 0
        assert result.gas_efficiency_improvement_percent < 0
        assert result.performance_grade == "D (Poor)"


class TestCalculateSummary:
    def test_calculate_summary_basic(self):
        from models import PeriodMetrics
        
        periods = [
            PeriodMetrics(
                period="business_hours",
                time_range="08:00-18:00",
                days=["Monday"],
                current_electric_kwh=45000,
                current_gas_therms=3200,
                baseline_electric_kwh=52000,
                baseline_gas_therms=4100,
                electric_savings_kwh=7000,
                gas_savings_therms=900,
                electric_cost_savings=840,
                gas_cost_savings=855,
                total_cost_savings=1695,
                electric_efficiency_improvement_percent=13.46,
                gas_efficiency_improvement_percent=21.95,
                overall_efficiency_improvement_percent=15.83,
                performance_grade="A (Very Good)"
            ),
            PeriodMetrics(
                period="after_hours",
                time_range="18:00-08:00",
                days=["Monday"],
                current_electric_kwh=28000,
                current_gas_therms=2200,
                baseline_electric_kwh=35000,
                baseline_gas_therms=2800,
                electric_savings_kwh=7000,
                gas_savings_therms=600,
                electric_cost_savings=560,
                gas_cost_savings=570,
                total_cost_savings=1130,
                electric_efficiency_improvement_percent=20.0,
                gas_efficiency_improvement_percent=21.43,
                overall_efficiency_improvement_percent=20.62,
                performance_grade="A+ (Excellent)"
            )
        ]
        
        summary = calculate_summary(periods)
        
        assert summary.total_electric_savings_kwh == 14000.0
        assert summary.total_gas_savings_therms == 1500.0
        assert summary.total_cost_savings == 2825.0
        assert summary.average_efficiency_improvement_percent == pytest.approx(18.225, rel=0.01)
        assert summary.best_performing_period == "after_hours"
        assert summary.worst_performing_period == "business_hours"

    def test_calculate_summary_empty_list(self):
        summary = calculate_summary([])
        
        assert summary.total_electric_savings_kwh == 0.0
        assert summary.total_gas_savings_therms == 0.0
        assert summary.total_cost_savings == 0.0
        assert summary.average_efficiency_improvement_percent == 0.0
        assert summary.best_performing_period == ""
        assert summary.worst_performing_period == ""
        assert summary.overall_performance_grade == "C (Needs Improvement)"


class TestCalculatePerformanceGrade:
    def test_performance_grade_excellent(self):
        assert calculate_performance_grade(25.0) == "A+ (Excellent)"
        assert calculate_performance_grade(20.0) == "A+ (Excellent)"

    def test_performance_grade_very_good(self):
        assert calculate_performance_grade(19.99) == "A (Very Good)"
        assert calculate_performance_grade(15.0) == "A (Very Good)"

    def test_performance_grade_good(self):
        assert calculate_performance_grade(14.99) == "B+ (Good)"
        assert calculate_performance_grade(10.0) == "B+ (Good)"

    def test_performance_grade_satisfactory(self):
        assert calculate_performance_grade(9.99) == "B (Satisfactory)"
        assert calculate_performance_grade(5.0) == "B (Satisfactory)"

    def test_performance_grade_needs_improvement(self):
        assert calculate_performance_grade(4.99) == "C (Needs Improvement)"
        assert calculate_performance_grade(0.0) == "C (Needs Improvement)"

    def test_performance_grade_poor(self):
        assert calculate_performance_grade(-1.0) == "D (Poor)"
        assert calculate_performance_grade(-10.0) == "D (Poor)"


class TestProcessEfficiencyCalculation:
    def test_process_efficiency_calculation_complete(self):
        request_data = {
            "building_id": "60f7b3b3e4b0f3d4c8b4567a",
            "measure_name": "High-Efficiency HVAC System",
            "periods": [
                {
                    "period": "business_hours",
                    "time_range": "08:00-18:00",
                    "days": ["Monday"],
                    "current_electric_kwh": 45000,
                    "current_gas_therms": 3200,
                    "baseline_electric_kwh": 52000,
                    "baseline_gas_therms": 4100,
                    "electric_rate": 0.12,
                    "gas_rate": 0.95
                }
            ]
        }
        
        result = process_efficiency_calculation(request_data)
        
        assert result["building_id"] == "60f7b3b3e4b0f3d4c8b4567a"
        assert result["measure_name"] == "High-Efficiency HVAC System"
        assert isinstance(result["calculation_timestamp"], datetime)
        assert len(result["periods"]) == 1
        assert "summary" in result
        assert result["summary"]["total_cost_savings"] > 0

