from sqlalchemy import Column, Integer, String, Float, CheckConstraint
from app.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    sku = Column(String, unique=True, nullable=False, index=True)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)

    __table_args__ = (
        CheckConstraint("price >= 0.0", name="check_product_price_non_negative"),
        CheckConstraint("quantity >= 0", name="check_product_quantity_non_negative"),
    )
