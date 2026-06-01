from pydantic import BaseModel, EmailStr, Field

class CustomerBase(BaseModel):
    full_name: str = Field(..., min_length=1, description="Customer's full name")
    email: EmailStr = Field(..., description="Customer's unique email address")
    phone: str = Field(..., min_length=1, description="Customer's phone number")

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id: int

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "full_name": "Aryan K.",
                "email": "aryan.k@example.com",
                "phone": "+1-555-0199"
            }
        }
