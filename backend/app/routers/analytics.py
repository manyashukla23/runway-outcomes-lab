from typing import List
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from app.database import get_db
from app.models import OrderItem, Product, Order, User
from app.schemas import (
    SummaryMetrics, CategoryReturnRate, RevenueByDepartment,
    RevenueByBrand, RevenueOverTime, DepartmentReturnRate,
    AgeDistribution, CountryRevenue
)

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary", response_model=SummaryMetrics)
def get_summary(db: Session = Depends(get_db)):
    """Get overall summary metrics"""
    
    # Total revenue (sum of sale_price for completed items)
    total_revenue = db.query(func.sum(OrderItem.sale_price)).filter(
        OrderItem.status == "Complete"
    ).scalar() or 0.0
    
    # Overall return rate
    total_items = db.query(func.count(OrderItem.id)).scalar() or 1
    returned_items = db.query(func.count(OrderItem.id)).filter(
        (OrderItem.status == "Returned") | (OrderItem.returned_at.isnot(None))
    ).scalar() or 0
    overall_return_rate = returned_items / total_items if total_items > 0 else 0.0
    
    # Top category by revenue
    top_category_revenue = db.query(
        Product.category,
        func.sum(OrderItem.sale_price).label("revenue")
    ).join(
        OrderItem, OrderItem.product_id == Product.id
    ).filter(
        OrderItem.status == "Complete"
    ).group_by(
        Product.category
    ).order_by(
        func.sum(OrderItem.sale_price).desc()
    ).first()
    
    top_category_by_revenue = top_category_revenue[0] if top_category_revenue and top_category_revenue[0] else "N/A"
    
    # Top category by return rate
    category_stats = db.query(
        Product.category,
        func.count(OrderItem.id).label("total"),
        func.sum(
            case((OrderItem.status == "Returned", 1), else_=0)
        ).label("returned")
    ).join(
        OrderItem, OrderItem.product_id == Product.id
    ).group_by(
        Product.category
    ).having(
        func.count(OrderItem.id) > 0
    ).all()
    
    top_category_by_return_rate = "N/A"
    max_return_rate = 0.0
    
    for category, total, returned in category_stats:
        rate = (returned or 0) / total if total > 0 else 0.0
        if rate > max_return_rate:
            max_return_rate = rate
            top_category_by_return_rate = category or "N/A"
    
    return SummaryMetrics(
        total_revenue=float(total_revenue),
        overall_return_rate=overall_return_rate,
        top_category_by_revenue=top_category_by_revenue,
        top_category_by_return_rate=top_category_by_return_rate
    )


@router.get("/returns-by-category", response_model=List[CategoryReturnRate])
def get_returns_by_category(db: Session = Depends(get_db)):
    """Get return rates grouped by product category"""
    
    results = db.query(
        Product.category,
        func.count(OrderItem.id).label("total_items"),
        func.sum(
            case((OrderItem.status == "Returned", 1), else_=0)
        ).label("returned_items")
    ).join(
        OrderItem, OrderItem.product_id == Product.id
    ).group_by(
        Product.category
    ).having(
        func.count(OrderItem.id) > 0
    ).all()
    
    return [
        CategoryReturnRate(
            category=category or "Unknown",
            total_items=int(total_items),
            returned_items=int(returned_items or 0),
            return_rate=(returned_items or 0) / total_items if total_items > 0 else 0.0
        )
        for category, total_items, returned_items in results
    ]


@router.get("/revenue-by-department", response_model=List[RevenueByDepartment])
def get_revenue_by_department(db: Session = Depends(get_db)):
    """Get revenue grouped by department"""
    results = db.query(
        Product.department,
        func.sum(OrderItem.sale_price).label("revenue"),
        func.count(OrderItem.id).label("order_count")
    ).join(
        OrderItem, OrderItem.product_id == Product.id
    ).filter(
        OrderItem.status == "Complete"
    ).group_by(
        Product.department
    ).order_by(
        func.sum(OrderItem.sale_price).desc()
    ).all()
    
    return [
        RevenueByDepartment(
            department=dept or "Unknown",
            revenue=float(revenue or 0),
            order_count=int(order_count or 0)
        )
        for dept, revenue, order_count in results
    ]


@router.get("/revenue-by-brand", response_model=List[RevenueByBrand])
def get_revenue_by_brand(db: Session = Depends(get_db), limit: int = 10):
    """Get top brands by revenue"""
    results = db.query(
        Product.brand,
        func.sum(OrderItem.sale_price).label("revenue"),
        func.count(func.distinct(Product.id)).label("product_count")
    ).join(
        OrderItem, OrderItem.product_id == Product.id
    ).filter(
        OrderItem.status == "Complete"
    ).group_by(
        Product.brand
    ).order_by(
        func.sum(OrderItem.sale_price).desc()
    ).limit(limit).all()
    
    return [
        RevenueByBrand(
            brand=brand or "Unknown",
            revenue=float(revenue or 0),
            product_count=int(product_count or 0)
        )
        for brand, revenue, product_count in results
    ]


@router.get("/revenue-over-time", response_model=List[RevenueOverTime])
def get_revenue_over_time(db: Session = Depends(get_db), days: int = 30):
    """Get daily revenue over the last N days"""
    from datetime import date as date_type
    start_date = datetime.now() - timedelta(days=days)
    
    results = db.query(
        func.date(OrderItem.created_at).label("date"),
        func.sum(OrderItem.sale_price).label("revenue"),
        func.count(func.distinct(OrderItem.order_id)).label("order_count")
    ).filter(
        OrderItem.status == "Complete",
        OrderItem.created_at >= start_date
    ).group_by(
        func.date(OrderItem.created_at)
    ).order_by(
        func.date(OrderItem.created_at)
    ).all()
    
    return [
        RevenueOverTime(
            date=date.strftime("%Y-%m-%d") if date else "",
            revenue=float(revenue or 0),
            order_count=int(order_count or 0)
        )
        for date, revenue, order_count in results
    ]


@router.get("/returns-by-department", response_model=List[DepartmentReturnRate])
def get_returns_by_department(db: Session = Depends(get_db)):
    """Get return rates grouped by department"""
    results = db.query(
        Product.department,
        func.count(OrderItem.id).label("total_items"),
        func.sum(
            case((OrderItem.status == "Returned", 1), else_=0)
        ).label("returned_items")
    ).join(
        OrderItem, OrderItem.product_id == Product.id
    ).group_by(
        Product.department
    ).having(
        func.count(OrderItem.id) > 0
    ).all()
    
    return [
        DepartmentReturnRate(
            department=dept or "Unknown",
            total_items=int(total_items),
            returned_items=int(returned_items or 0),
            return_rate=(returned_items or 0) / total_items if total_items > 0 else 0.0
        )
        for dept, total_items, returned_items in results
    ]


@router.get("/age-distribution", response_model=List[AgeDistribution])
def get_age_distribution(db: Session = Depends(get_db)):
    """Get customer age distribution with average order value"""
    results = db.query(
        case(
            (User.age < 18, "Under 18"),
            (User.age < 25, "18-24"),
            (User.age < 35, "25-34"),
            (User.age < 45, "35-44"),
            (User.age < 55, "45-54"),
            (User.age < 65, "55-64"),
            else_="65+"
        ).label("age_range"),
        func.count(func.distinct(User.id)).label("customer_count"),
        func.avg(OrderItem.sale_price).label("avg_order_value")
    ).join(
        OrderItem, OrderItem.user_id == User.id
    ).filter(
        OrderItem.status == "Complete",
        User.age.isnot(None)
    ).group_by(
        "age_range"
    ).all()
    
    return [
        AgeDistribution(
            age_range=age_range or "Unknown",
            customer_count=int(count or 0),
            avg_order_value=float(avg_value or 0)
        )
        for age_range, count, avg_value in results
    ]


@router.get("/revenue-by-country", response_model=List[CountryRevenue])
def get_revenue_by_country(db: Session = Depends(get_db), limit: int = 10):
    """Get top countries by revenue"""
    results = db.query(
        User.country,
        func.sum(OrderItem.sale_price).label("revenue"),
        func.count(func.distinct(User.id)).label("customer_count")
    ).join(
        OrderItem, OrderItem.user_id == User.id
    ).filter(
        OrderItem.status == "Complete",
        User.country.isnot(None)
    ).group_by(
        User.country
    ).order_by(
        func.sum(OrderItem.sale_price).desc()
    ).limit(limit).all()
    
    return [
        CountryRevenue(
            country=country or "Unknown",
            revenue=float(revenue or 0),
            customer_count=int(customer_count or 0)
        )
        for country, revenue, customer_count in results
    ]

