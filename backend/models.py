from sqlmodel import SQLModel, Field
from datetime import date
from typing import Optional

class Expense(SQLModel, table=True):
    __tablename__ = "expenses"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    category: str
    amount: float
    date: date
    description: Optional[str] = None