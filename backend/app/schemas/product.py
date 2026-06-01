from pydantic import BaseModel, Field

class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, description="Product name")
    sku: str = Field(..., min_length=1, description="Stock Keeping Unit (SKU)")
    price: float = Field(..., ge=0.0, description="Product unit price")
    quantity: int = Field(..., ge=0, description="Stock quantity")

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "Wireless Keyboard Pro",
                "sku": "WKP-001",
                "price": 89.99,
                "quantity": 342
            }
        }
