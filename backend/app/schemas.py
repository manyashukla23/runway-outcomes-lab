from pydantic import BaseModel
from typing import List, Optional


class SummaryMetrics(BaseModel):
    total_revenue: float
    overall_return_rate: float
    top_category_by_revenue: str
    top_category_by_return_rate: str


class CategoryReturnRate(BaseModel):
    category: str
    total_items: int
    returned_items: int
    return_rate: float


class ProductInput(BaseModel):
    product_id: int
    category: str
    brand: str
    department: str
    price: float
    discount_pct: float
    customer_age: int
    customer_country: str


class PredictReturnsRequest(BaseModel):
    products: List[ProductInput]


class PredictionResult(BaseModel):
    product_id: int
    return_probability: float
    risk_label: str


class PredictReturnsResponse(BaseModel):
    predictions: List[PredictionResult]


class RevenueByDepartment(BaseModel):
    department: str
    revenue: float
    order_count: int


class RevenueByBrand(BaseModel):
    brand: str
    revenue: float
    product_count: int


class RevenueOverTime(BaseModel):
    date: str
    revenue: float
    order_count: int


class DepartmentReturnRate(BaseModel):
    department: str
    total_items: int
    returned_items: int
    return_rate: float


class AgeDistribution(BaseModel):
    age_range: str
    customer_count: int
    avg_order_value: float


class CountryRevenue(BaseModel):
    country: str
    revenue: float
    customer_count: int

