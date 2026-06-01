from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class OrderItemCreate(BaseModel):
    product_id: int = Field(..., ge=1, description="ID of the product to order")
    quantity: int = Field(..., ge=1, description="Quantity to purchase")

class OrderCreate(BaseModel):
    customer_id: int = Field(..., ge=1, description="ID of the customer ordering")
    items: List[OrderItemCreate] = Field(..., min_length=1, description="List of items in the order")

class OrderItemResponse(BaseModel):
    product_id: int
    quantity: int
    unit_price: float
    product_name: Optional[str] = None  # UI helper property

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    created_at: datetime
    items: List[OrderItemResponse]
    customer_name: Optional[str] = None  # UI helper property

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "customer_id": 2,
                "total_amount": 179.98,
                "created_at": "2026-06-01T12:00:00Z",
                "items": [
                    {
                        "product_id": 1,
                        "quantity": 2,
                        "unit_price": 89.99,
                        "product_name": "Wireless Keyboard Pro"
                    }
                ],
                "customer_name": "Aryan K."
            }
        }
