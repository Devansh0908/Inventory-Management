from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from typing import List

from app.database import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductResponse

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(product_in: ProductCreate, db: AsyncSession = Depends(get_db)):
    if product_in.quantity < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quantity cannot be negative"
        )
    if product_in.price < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Price cannot be negative"
        )

    # Check for duplicate SKU before attempting insert to respond with 409
    query = select(Product).where(Product.sku == product_in.sku)
    result = await db.execute(query)
    existing_product = result.scalars().first()
    if existing_product:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"SKU '{product_in.sku}' already exists"
        )

    db_product = Product(
        name=product_in.name,
        sku=product_in.sku,
        price=product_in.price,
        quantity=product_in.quantity
    )
    db.add(db_product)
    try:
        await db.commit()
        await db.refresh(db_product)
    except IntegrityError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"SKU already exists or integrity constraint violated: {str(e.orig)}"
        )
    return db_product

@router.get("/", response_model=List[ProductResponse])
async def list_products(db: AsyncSession = Depends(get_db)):
    query = select(Product).order_by(Product.id)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Product).where(Product.id == product_id)
    result = await db.execute(query)
    product = result.scalars().first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )
    return product

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(product_id: int, product_in: ProductCreate, db: AsyncSession = Depends(get_db)):
    if product_in.quantity < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quantity cannot be negative"
        )
    if product_in.price < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Price cannot be negative"
        )

    query = select(Product).where(Product.id == product_id)
    result = await db.execute(query)
    db_product = result.scalars().first()
    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )

    # Check for SKU conflict if SKU is being updated
    if db_product.sku != product_in.sku:
        sku_query = select(Product).where(Product.sku == product_in.sku)
        sku_result = await db.execute(sku_query)
        sku_exists = sku_result.scalars().first()
        if sku_exists:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"SKU '{product_in.sku}' already exists"
            )

    db_product.name = product_in.name
    db_product.sku = product_in.sku
    db_product.price = product_in.price
    db_product.quantity = product_in.quantity

    try:
        await db.commit()
        await db.refresh(db_product)
    except IntegrityError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Failed to update due to database integrity constraints: {str(e.orig)}"
        )
    return db_product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(product_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Product).where(Product.id == product_id)
    result = await db.execute(query)
    product = result.scalars().first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )
    await db.delete(product)
    try:
        await db.commit()
    except IntegrityError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Cannot delete product because it is referenced in an active order: {str(e.orig)}"
        )
