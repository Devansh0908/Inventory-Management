from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from typing import List, Dict, Any

from app.database import get_db
from app.models.product import Product
from app.models.customer import Customer
from app.models.order import Order
from app.schemas.product import ProductResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    # 1. Count products
    prod_count_query = select(func.count(Product.id))
    prod_count_res = await db.execute(prod_count_query)
    total_products = prod_count_res.scalar() or 0

    # 2. Count customers
    cust_count_query = select(func.count(Customer.id))
    cust_count_res = await db.execute(cust_count_query)
    total_customers = cust_count_res.scalar() or 0

    # 3. Count orders
    ord_count_query = select(func.count(Order.id))
    ord_count_res = await db.execute(ord_count_query)
    total_orders = ord_count_res.scalar() or 0

    # 3.1 Calculate total revenue
    rev_query = select(func.sum(Order.total_amount))
    rev_res = await db.execute(rev_query)
    total_revenue = rev_res.scalar() or 0.0

    # 4. Get products with quantity <= 5
    low_stock_query = select(Product).where(Product.quantity <= 5).order_by(Product.quantity)
    low_stock_res = await db.execute(low_stock_query)
    low_stock_products = low_stock_res.scalars().all()

    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "low_stock_products": [ProductResponse.model_validate(p) for p in low_stock_products]
    }
