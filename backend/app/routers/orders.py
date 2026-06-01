from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from typing import List

from app.database import get_db
from app.models.customer import Customer
from app.models.product import Product
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate, OrderResponse

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(order_in: OrderCreate, db: AsyncSession = Depends(get_db)):
    # 1. Verify customer exists
    customer_query = select(Customer).where(Customer.id == order_in.customer_id)
    customer_res = await db.execute(customer_query)
    customer = customer_res.scalars().first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with ID {order_in.customer_id} not found"
        )

    # 2. Group duplicate product requests to calculate correct total quantities to verify
    requested_totals = {}
    for item in order_in.items:
        if item.quantity <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Quantity must be greater than zero for all items"
            )
        requested_totals[item.product_id] = requested_totals.get(item.product_id, 0) + item.quantity

    total_amount = 0.0
    order_items_to_create = []

    # 3. Retrieve and lock products to deduct stock atomically
    for product_id, quantity in requested_totals.items():
        product_query = select(Product).where(Product.id == product_id).with_for_update()
        product_res = await db.execute(product_query)
        product = product_res.scalars().first()

        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with ID {product_id} not found"
            )

        if product.quantity < quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for product: {product.name}"
            )

        # Deduct quantity
        product.quantity -= quantity
        
        # Calculate price contribution
        total_amount += quantity * product.price

        # Prepare OrderItem
        order_item = OrderItem(
            product_id=product_id,
            product=product,
            quantity=quantity,
            unit_price=product.price
        )
        order_items_to_create.append(order_item)

    # 4. Save order
    db_order = Order(
        customer_id=order_in.customer_id,
        customer=customer,
        total_amount=total_amount,
        items=order_items_to_create
    )
    db.add(db_order)

    try:
        await db.commit()
    except IntegrityError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to create order due to constraint violation: {str(e.orig)}"
        )

    # Re-fetch order with all selectin relationships fully loaded
    query = select(Order).where(Order.id == db_order.id)
    result = await db.execute(query)
    db_order = result.scalars().first()
    return db_order

@router.get("/", response_model=List[OrderResponse])
async def list_orders(db: AsyncSession = Depends(get_db)):
    query = select(Order).order_by(Order.id.desc())
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Order).where(Order.id == order_id)
    result = await db.execute(query)
    order = result.scalars().first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found"
        )
    return order

@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_order(order_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Order).where(Order.id == order_id)
    result = await db.execute(query)
    order = result.scalars().first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found"
        )

    # Restore stock for each item in the order
    for item in order.items:
        product_query = select(Product).where(Product.id == item.product_id).with_for_update()
        product_res = await db.execute(product_query)
        product = product_res.scalars().first()
        if product:
            product.quantity += item.quantity

    await db.delete(order)
    try:
        await db.commit()
    except IntegrityError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to cancel order: {str(e.orig)}"
        )
